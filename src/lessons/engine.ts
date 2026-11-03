import type {Exercise,Lesson} from './types';
import dailyStandup from '../data/daily-standup.json';
export const lessons:Lesson[]=[dailyStandup as Lesson];
export const getLesson=(id:string)=>lessons.find(lesson=>lesson.id===id);
export const normalize=(value:string)=>value.trim().replace(/\\s+/g,' ').toLocaleLowerCase('en');
export const checkAnswer=(exercise:Exercise,value:number|string|string[]|undefined):boolean=>{
  if(exercise.type==='fill-blank')return typeof value==='string'&&[exercise.answer,...(exercise.acceptableAnswers??[])].some(v=>normalize(v)===normalize(value));
  if(exercise.type==='sentence-order')return Array.isArray(value)&&value.length===exercise.answer.length&&value.every((token,i)=>token===exercise.answer[i]);
  return typeof value==='number'&&value===exercise.answer;
};
export const getCompleted=():boolean=>{try{return localStorage.getItem('efi-daily-done')==='yes'}catch{return false}};
