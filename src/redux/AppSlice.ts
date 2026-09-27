import { Result } from "@/app/QuizScreen";
import { createSlice } from "@reduxjs/toolkit";
import { Question } from "../app";

const initialState = {
    questions: [] as Question[],
    results: [] as Result[],
};

//here we define the slice that contains the reducer logic
export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setQestions: (state, action) => {
            const {questions} = action.payload;
            
            if(questions != undefined)
            state.questions = questions;
            
            
        },
        setResults: (state, action)=>{
            const {results} = action.payload;
            if(results != undefined)
            state.results = results;
        },


    }
});

//finally, we export the actions and the reducer
export const { setQestions, setResults}
    = appSlice.actions;
export default appSlice.reducer;


//finally, we export the actions and the reducer
