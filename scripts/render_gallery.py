"""Render fixed views from the approved model; never mutate source geometry."""
from pathlib import Path
import copy,hashlib,json
import numpy as np
from PIL import Image
import render_geometry as R
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'public/sala/scene.json'
original=copy.deepcopy(R.D);before=hashlib.sha256(SOURCE.read_bytes()).hexdigest()
R.ROOT=ROOT/'public/gallery';R.ROOT.mkdir(exist_ok=True)
rooms=[('soggiorno','Soggiorno',(0,5.09,-3.72,0)),('cucina','Cucina',(0,3.8411,-5.82,-3.72)),('zona-giorno','Soggiorno + cucina',(0,5.09,-5.82,0)),('bagno','Bagno',(0,3.8411,-7.47,-5.82)),('camera','Camera da letto',(0,3.37,-10.97,-7.58)),('cabina','Cabina armadio',(3.46,5.09,-10.97,-8.5759))]
size=(1100,760);sheet=Image.new('RGB',(size[0]*3,size[1]*6));manifest=[]
for row,(ident,title,bounds) in enumerate(rooms):
 x1,x2,y1,y2=bounds;objects=[]
 for ob in original['objects']:
  kind=ob['kind'];name=ob['id'];v=np.array(ob['vertices'])
  if kind in ['ceiling','ceiling_fixture','substrate','apron']:continue
  if v[:,0].max()<x1 or v[:,0].min()>x2 or v[:,1].max()<y1 or v[:,1].min()>y2:continue
  if kind not in ['wall','floorboard','floor','window']:
   center=v.mean(axis=0)
   if not(x1<=center[0]<=x2 and y1<=center[1]<=y2):continue
  item=copy.deepcopy(ob)
  if kind in ['wall','floorboard','floor']:
   v[:,0]=np.clip(v[:,0],x1,x2);v[:,1]=np.clip(v[:,1],y1,y2)
   if kind=='wall':
    if v[:,2].min()>=.55:continue
    v[:,2]=np.minimum(v[:,2],.55)
   item['vertices']=v.tolist()
  objects.append(item)
 R.D={'objects':objects,'materials':original['materials']}
 cx=(x1+x2)/2;cy=(y1+y2)/2
 cameras=[((cx+7,cy-9,9),(cx,cy,.6)),((cx-7,cy+8,10),(cx,cy,.6)),((cx,cy,20),(cx,cy,0))]
 if ident=='cucina':cameras[0]=((cx+5,cy+8,7),(cx,cy,.7))
 for col,(eye,target) in enumerate(cameras):
  img=R.render(f'{ident}-{col+1}.png','prop',eye,target,size)
  sheet.paste(img,(col*size[0],row*size[1]))
 manifest.append({'id':ident,'title':title,'row':row,'objects':len(objects)})
sheet.save(R.ROOT/'rooms.webp','WEBP',quality=90,method=6)
assert before==hashlib.sha256(SOURCE.read_bytes()).hexdigest()
(ROOT/'scripts/gallery-provenance.json').write_text(json.dumps({'sourceSha256':before,'viewsPerRoom':3,'rooms':manifest,'presentation':'Boundary walls sectioned at 0.55 m, ceiling hidden; original furniture unchanged.'},indent=2))
print('18 views; source unchanged',before)
