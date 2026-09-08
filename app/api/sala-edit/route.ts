import { NextResponse } from 'next/server';
export async function POST(){return NextResponse.json({error:'Le modifiche sono disattivate. L’app mostra soltanto viste statiche.'},{status:410});}
