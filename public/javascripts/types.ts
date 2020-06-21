// Nowe typy danych
export interface Question {
    content: string;
    answers: string[];
    correct: number;
    penalty: number;
}

export interface Quiz {
    intro: string;
    questions: Question[];
}

export interface Stats {
    quiz: string;
    user: string;
    result: number;
}