#!/usr/bin/env python3
"""Deterministic offline orthographic rasterization of the actual OBJ source meshes."""
from pathlib import Path
import json, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy.ndimage import gaussian_filter

ROOT=Path(__file__).resolve().parents[1]
D=json.loads((ROOT/'public/sala/scene.json').read_text())
PALETTE=D['materials']

def normalized(v):
    v=np.array(v,dtype=float);return v/np.linalg.norm(v)

def geometry(mode,only=None):
    triangles=[];colors=[];kinds=[]
    for ob in D['objects']:
        kind=ob['kind'];ident=ob['id']
        if only is not None and not only(ob):continue
        if mode!='ceiling' and kind in ['ceiling','ceiling_fixture']:continue
        if mode=='ceiling' and kind not in ['ceiling_fixture','wall','column']:continue
        if mode=='plan' and kind in ['substrate','floor','floorboard','apron']:continue
        v=np.array(ob['vertices'],dtype=float).copy()
        if mode in ['plan','overview'] and kind=='wall':
            cap=2.70 if mode=='overview' and ob['metadata'].get('wallId') in ['exterior_west','exterior_north'] else 1.05
            # Presentation section; full-height source meshes remain untouched.
            if v[:,2].min()>=cap-.001:continue
            v[:,2]=np.minimum(v[:,2],cap)
        if mode=='plan' and v[:,2].min()>1.08:continue
        for f in ob['faces']:
            for i in range(1,len(f)-1):
                tri=v[[f[0],f[i],f[i+1]]]
                if np.linalg.norm(np.cross(tri[1]-tri[0],tri[2]-tri[0]))<1e-9:continue
                triangles.append(tri);colors.append(PALETTE[ob['material']]);kinds.append(kind)
    return np.array(triangles),np.array(colors),kinds

def camera(tris,eye,target,size,padding=.08):
    fw=normalized(np.array(target)-np.array(eye));hint=[0,0,1]
    if abs(fw[2])>.999:hint=[0,1,0]
    right=normalized(np.cross(fw,hint));up=np.cross(right,fw)
    basis=np.stack([right,up,fw],axis=1)
    coords=tris@basis;flat=coords.reshape(-1,3)
    lo=flat[:,:2].min(axis=0);hi=flat[:,:2].max(axis=0);mid=(lo+hi)/2
    width,height=size;scale=min(width*(1-2*padding)/(hi[0]-lo[0]),height*(1-2*padding)/(hi[1]-lo[1]))
    screen=coords.copy();screen[:,:,0]=(coords[:,:,0]-mid[0])*scale+width/2
    screen[:,:,1]=height/2-(coords[:,:,1]-mid[1])*scale
    return screen,dict(basis=basis,mid=mid,scale=scale,size=size)

def raster(screen,colors,size,background=(.956,.951,.93),ids=False):
    width,height=size;depth=np.full((height,width),np.inf,dtype=np.float32)
    canvas=np.broadcast_to(np.array(background,dtype=np.float32),(height,width,3)).copy()
    inds=np.full((height,width),-1,dtype=np.int32)
    for ti,tri in enumerate(screen):
        x0,y0,d0=tri[0];x1,y1,d1=tri[1];x2,y2,d2=tri[2]
        den=(y1-y2)*(x0-x2)+(x2-x1)*(y0-y2)
        if abs(den)<1e-8:continue
        a=max(0,int(math.floor(min(x0,x1,x2))));b=min(width-1,int(math.ceil(max(x0,x1,x2))))
        c=max(0,int(math.floor(min(y0,y1,y2))));e=min(height-1,int(math.ceil(max(y0,y1,y2))))
        if a>b or c>e:continue
        xx=np.arange(a,b+1,dtype=float)[None,:]+.5;yy=np.arange(c,e+1,dtype=float)[:,None]+.5
        u=((y1-y2)*(xx-x2)+(x2-x1)*(yy-y2))/den
        v=((y2-y0)*(xx-x2)+(x0-x2)*(yy-y2))/den;w=1-u-v
        d=u*d0+v*d1+w*d2
        roi=depth[c:e+1,a:b+1];inside=(u>=-1e-6)&(v>=-1e-6)&(w>=-1e-6)&(d<roi)
        roi[inside]=d[inside];canvas[c:e+1,a:b+1][inside]=colors[ti];inds[c:e+1,a:b+1][inside]=ti
    return canvas,depth,inds

def render(name,mode='overview',eye=(13,-19,18),target=(2.5,-5.5,0),size=(1500,1600),only=None):
    tris,base,kinds=geometry(mode,only)
    norms=np.cross(tris[:,1]-tris[:,0],tris[:,2]-tris[:,0]);norms/=np.linalg.norm(norms,axis=1)[:,None]
    light=normalized([-4,-2,10]);lambert=np.clip(norms@light,0,1)
    if mode in ['plan','ceiling']:
        colors=np.ones_like(base)*.95
        for i,k in enumerate(kinds):
            val=.32 if k in ['wall','column'] else (.80 if k=='window' else .97)
            colors[i]=val
    else:colors=np.clip(base*(.64+.36*lambert[:,None]),0,1)
    screen,cam=camera(tris,eye,target,size)
    canvas,depth,inds=raster(screen,colors,size)
    valid=inds>=0
    if mode not in ['plan','ceiling']:
        shadow_screen,shcam=camera(tris,(-5,5,20),(2.5,-5.5,0),(900,900),.035)
        _,shdepth,_=raster(shadow_screen,np.ones_like(colors),(900,900))
        yy,xx=np.indices(depth.shape);coords=np.zeros((*depth.shape,3))
        coords[:,:,0]=(xx+.5-size[0]/2)/cam['scale']+cam['mid'][0]
        coords[:,:,1]=(size[1]/2-yy-.5)/cam['scale']+cam['mid'][1]
        coords[:,:,2]=np.where(valid,depth,0)
        world=coords@cam['basis'].T;lightcoords=world@shcam['basis']
        sx=np.rint((lightcoords[:,:,0]-shcam['mid'][0])*shcam['scale']+450).astype(int)
        sy=np.rint(450-(lightcoords[:,:,1]-shcam['mid'][1])*shcam['scale']).astype(int)
        inside=valid&(sx>=0)&(sx<900)&(sy>=0)&(sy<900)
        sample=shdepth[np.clip(sy,0,899),np.clip(sx,0,899)]
        shadow=inside&(lightcoords[:,:,2]>sample+.035)
        soft=gaussian_filter(shadow.astype(float),1.1)
        canvas*=1-.20*soft[:,:,None]
    # Thin object contours keep construction and furniture silhouettes readable.
    edge=np.zeros(depth.shape,dtype=bool)
    for axis,shift in [(0,1),(0,-1),(1,1),(1,-1)]:
        neighbor=np.roll(inds,shift,axis=axis)
        if mode in ['plan','ceiling']:
            diff=valid&(neighbor!=inds)
            nidx=np.clip(neighbor,0,len(kinds)-1);idx=np.clip(inds,0,len(kinds)-1)
            # Ignore triangle splits belonging to a coplanar face.
            dot=(norms[idx]*norms[nidx]).sum(axis=2)
            neighbor_depth=np.roll(depth,shift,axis=axis)
            delta=np.abs(np.where(np.isfinite(neighbor_depth),neighbor_depth,999)-np.where(np.isfinite(depth),depth,999))
            diff &= (dot<.95)|(neighbor<0)|(delta>.003)
        else:
            diff=valid&(neighbor<0)
        edge|=diff
    if mode in ['plan','ceiling']:canvas[edge]=.18
    else:canvas[edge]*=.78
    image=Image.fromarray((np.clip(canvas,0,1)*255).astype(np.uint8))
    path=ROOT/name;path.parent.mkdir(exist_ok=True,parents=True);image.save(path)
    print(str(path),flush=True)
    return image

def contact():
    items=[('Tavolo e sedie',lambda o:o['id'].startswith(('dining','chair'))),
           ('Divano',lambda o:o['id'].startswith('sofa')),
           ('Contenitore 3 / mobile TV / colonna',lambda o:o['kind'] in ['storage','tv_unit'] or o['id']=='column_living'),
           ('Cucina a L',lambda o:o['kind']=='kitchen'),
           ('Bagno e lavanderia',lambda o:o['kind'] in ['bathroom','appliance','laundry_screen']),
           ('Letto e comodini',lambda o:o['id'].startswith(('bed_','bedroom_dresser')))]
    sheet=Image.new('RGB',(1500,1050),'#f4f2ea');draw=ImageDraw.Draw(sheet)
    font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',19)
    for i,(label,fn) in enumerate(items):
        im=render(f'images/prop-study-{i+1}.png','prop',size=(500,450),only=fn)
        xx=i%3*500;yy=i//3*525;sheet.paste(im,(xx,yy+55));draw.text((xx+18,yy+14),label,font=font,fill='#24241f')
    sheet.save(ROOT/'images/prop-contact-sheet.png')

if __name__=='__main__':
    render('renders/casa-milano-anteprima.png')
    render('plans/lower-room.png','plan',(2.5,-5.5,25),(2.5,-5.5,0),(1000,2000))
    render('plans/reflected-ceiling.png','ceiling',(2.5,-5.5,25),(2.5,-5.5,0),(1000,2000))
    render('plans/elevation-west.png','prop',(-20,-5.5,1.35),(2.5,-5.5,1.35),(1800,650),lambda o:o['metadata'].get('wallId')=='exterior_west' or o['kind']=='window')
    contact()
