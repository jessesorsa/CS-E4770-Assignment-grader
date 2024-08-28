import { assign } from 'svelte/internal';
import { readable, writable } from 'svelte/store';

let initial_user = localStorage.getItem('userUuid');
if (!initial_user) {
  initial_user = crypto.randomUUID().toString();
  localStorage.setItem('userUuid', initial_user);
}
export const userUuid = readable(initial_user);


let initial_assignment_order = localStorage.getItem('assignment_order');
let initial_scores = localStorage.getItem('scores');
let initial_sum = localStorage.getItem('score_sum');

if (!initial_assignment_order) {
  initial_assignment_order = 1;
  localStorage.setItem('assignment_order', initial_assignment_order);
}

if (!initial_scores) {
  initial_scores = [];
  localStorage.setItem('scores', initial_scores);
}

if (!initial_sum) {
  initial_sum = 0;
  localStorage.setItem('score_sum', initial_sum);
}

export let score_sum = writable(initial_sum);
export let scores = writable(initial_scores);
export let assignmentOrder = writable(initial_assignment_order);

const assignmentStore = () => {
  return {
    set: (value) => {
      assignmentOrder.set(value);
      localStorage.setItem('assignment_order', value);
    },
    increment: () => {
      assignmentOrder.update(n => {
        const newValue = n + 1;
        localStorage.setItem('assignment_order', newValue);
        return newValue;
      })
    },
    decrease: () => {
      assignmentOrder.update(n => {
        const newValue = n - 1;
        localStorage.setItem('assignment_order', newValue);
        return newValue;
      })
    },
    addScore: (score) => {
      console.log("adding_score");
      scores.update(currentScores => {
        const newScores = [...currentScores, score];
        localStorage.setItem('scores', JSON.stringify(newScores));
        return newScores;
      });
      scores.subscribe(currentScores => {
        const sum = currentScores.reduce((acc, curr) => acc + curr, 0);
        score_sum.set(sum);
        localStorage.setItem('score_sum', sum);
      });
    },
    defaultScoreAndSum: () => {
      console.log("resetting");
      scores.set([]);
      score_sum.set(0);
      localStorage.setItem('score_sum', 0);
      localStorage.setItem('scores', []);
    }
  }
}

let initialNextAccess = localStorage.getItem('next_access');
let initialDefaultProgress = localStorage.getItem('progress');

if (!initialNextAccess) {
  initialNextAccess = false;
  localStorage.setItem('next_access', initialNextAccess);
}

if (!initialDefaultProgress) {
  initialDefaultProgress = true;
  localStorage.setItem('progress', initialDefaultProgress);
}

export let nextAccess = writable(initialNextAccess);
export let defaultProgress = writable(initialDefaultProgress);

const accessStore = () => {
  return {
    set: (value) => {
      nextAccess.set(value);
      localStorage.setItem('next_access', value);
    },
    setProgress: (value) => {
      defaultProgress.set(value);
      localStorage.setItem('progress', value)
    }
  }
}



export { assignmentStore, accessStore }