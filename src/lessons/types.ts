export type MultipleChoiceExercise = {id:string;type:'multiple-choice'|'dialogue';prompt:string;options:string[];answer:number;explanation:string};
export type FillBlankExercise = {id:string;type:'fill-blank';prompt:string;answer:string;acceptableAnswers?:string[];hint?:string;explanation:string};
export type SentenceOrderExercise = {id:string;type:'sentence-order';prompt:string;tokens:string[];answer:string[];explanation:string};
export type Exercise = MultipleChoiceExercise|FillBlankExercise|SentenceOrderExercise;
export type Lesson = {id:string;courseId:string;title:string;level:string;description:string;exercises:Exercise[]};
