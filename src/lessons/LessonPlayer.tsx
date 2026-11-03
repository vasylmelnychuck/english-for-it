import {useState} from 'react';
import {ArrowLeft,ChevronRight,RotateCcw} from 'lucide-react';
import type {Exercise,Lesson} from './types';
import {checkAnswer} from './engine';
import './lesson.css';
type Answer=number|string|string[];
type Props={lesson:Lesson;onExit:()=>void;onComplete:(score:number,total:number)=>void};
function ExerciseInput({exercise,value,onChange,locked}:{exercise:Exercise;value:Answer|undefined;onChange:(answer:Answer)=>void;locked:boolean}){
 if(exercise.type==='fill-blank')return <div className="fill-answer"><label htmlFor="answer">Впиши пропущене слово</label><input id="answer" autoComplete="off" disabled={locked} value={typeof value==='string'?value:''} onChange={e=>onChange(e.target.value)} placeholder={exercise.hint??'Your answer'}/></div>;
 if(exercise.type==='sentence-order'){
   const selected=Array.isArray(value)?value:[];
   const remaining=exercise.tokens.map((token,index)=>({token,index})).filter(({index})=>selected.filter(t=>t===exercise.tokens[index]).length<exercise.tokens.slice(0,index+1).filter(t=>t===exercise.tokens[index]).length);
   return <div className="order-answer"><p className="muted">Натискай слова в правильному порядку</p><div className="assembled">{selected.length?selected.map((token,i)=><button disabled={locked} key={i} onClick={()=>onChange(selected.filter((_,j)=>j!==i))}>{token} ×</button>):<span>Тут з’явиться твоє речення</span>}</div><div className="word-bank">{remaining.map(({token,index})=><button disabled={locked} key={index} onClick={()=>onChange([...selected,token])}>{token}</button>)}</div><button className="reset-answer" disabled={locked||!selected.length} onClick={()=>onChange([])}><RotateCcw size={15}/> Очистити</button></div>;
 }
 return <div className="options">{exercise.options.map((option,index)=><button disabled={locked} key={index} className={value===index?'selected':''} onClick={()=>onChange(index)}><span>{String.fromCharCode(65+index)}</span>{option}</button>)}</div>;
}
export function LessonPlayer({lesson,onExit,onComplete}:Props){
 const[index,setIndex]=useState(0),[answers,setAnswers]=useState<Record<string,Answer>>({}),[submitted,setSubmitted]=useState<Record<string,boolean>>({});
 const exercise=lesson.exercises[index],value=answers[exercise.id],locked=Boolean(submitted[exercise.id]),correct=locked&&checkAnswer(exercise,value);
 const ready=exercise.type==='sentence-order'?Array.isArray(value)&&value.length>0:exercise.type==='fill-blank'?typeof value==='string'&&value.trim().length>0:typeof value==='number';
 const next=()=>{if(!locked){setSubmitted(prev=>({...prev,[exercise.id]:true}));return;}if(index<lesson.exercises.length-1){setIndex(i=>i+1);return;}const total=lesson.exercises.length;const score=lesson.exercises.filter(e=>checkAnswer(e,answers[e.id])).length;onComplete(score,total)};
 return <><button className="back" onClick={onExit}><ArrowLeft size={18}/> До курсу</button><div className="lesson-head"><div><small>{lesson.level} · {lesson.courseId.toUpperCase()}</small><h1>{lesson.title}</h1><p className="muted">{lesson.description}</p></div><b>{index+1} / {lesson.exercises.length}</b></div><div className="progress"><span style={{width:((index+1)/lesson.exercises.length*100)+'%'}}/></div><div className="panel exercise"><h2>{exercise.prompt}</h2><p className="muted">{exercise.type==='dialogue'?'Вибери найкращу репліку':exercise.type==='multiple-choice'?'Вибери правильну відповідь':exercise.type==='fill-blank'?'Заповни пропуск':'Склади речення зі слів'}</p><ExerciseInput exercise={exercise} value={value} locked={locked} onChange={answer=>setAnswers(prev=>({...prev,[exercise.id]:answer}))}/>{locked&&<div className={'feedback '+(correct?'':'incorrect')} role="status"><b>{correct?'✓ Правильно!':'✕ Неправильно'}</b><p>{exercise.explanation}</p></div>}<button className="primary" disabled={!ready} onClick={next}>{!locked?'Перевірити':index===lesson.exercises.length-1?'Завершити урок':'Наступне питання'} <ChevronRight size={18}/></button></div></>;
}
