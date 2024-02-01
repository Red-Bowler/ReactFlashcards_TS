import _ from "lodash";
import { Test } from "../data/tests";

export const readFromLocal = (key: string) => {
    const local = localStorage.getItem(key);
    if (local == null) return {};

    return JSON.parse(local);
};

export const writeToLocal = (key: string, data: {}) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const fakeBusy = (length = 5000) => {
    setTimeout(() => {
        console.log("fake busy ended");
    }, length);
};

export const shuffleArray = (array: any) => {
    const newArray = _.cloneDeep(array);
    let currentIndex = newArray.length;
    let randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [newArray[currentIndex], newArray[randomIndex]] = [
            newArray[randomIndex],
            newArray[currentIndex],
        ];
    }

    return newArray;
};

export const backToTop = () => {
    window.scrollTo(0, 0);
};
export const randomInt = (lower: number, upper: number) => {
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

export const getRandomMondai = (test: Test) => {
    const options = test.mondaiOptions;
    const questions = test.mondai;

    let randomArray = [] as any[];
    let randomNumbers = [] as number[];

    const easyLimit =
        options.easy > questions.easy.length
            ? questions.easy.length
            : options.easy;
    const midLimit =
        options.mid > questions.mid.length ? questions.mid.length : options.mid;
    const hardLimit =
        options.hard > questions.hard.length
            ? questions.hard.length
            : options.hard;

    //pick questions from easy
    while (randomNumbers.length < easyLimit) {
        let number = randomInt(0, questions.easy.length - 1);

        //si randomNumbersArray no contiene
        if (!randomNumbers.includes(number)) {
            randomNumbers.push(number);
        }
    }

    randomArray = [
        ...randomArray,
        ...randomNumbers.map((item) => questions.easy[item]),
    ];
    randomNumbers = [];

    //pick questions from mid
    while (randomNumbers.length < midLimit) {
        let number = randomInt(0, questions.mid.length - 1);

        //si randomNumbersArray no contiene
        if (!randomNumbers.includes(number)) {
            randomNumbers.push(number);
        }
    }

    randomArray = [
        ...randomArray,
        ...randomNumbers.map((item) => questions.mid[item]),
    ];
    randomNumbers = [];

    //pick questions from hard
    while (randomNumbers.length < hardLimit) {
        let number = randomInt(0, questions.hard.length - 1);

        //si randomNumbersArray no contiene
        if (!randomNumbers.includes(number)) {
            randomNumbers.push(number);
        }
    }

    randomArray = [
        ...randomArray,
        ...randomNumbers.map((item) => questions.hard[item]),
    ];

    return randomArray;
};

export const chooseFiveMondai = (test: Test, randomNumberArray: number[]) => {
    let mondaiArray = [];

    mondaiArray = randomNumberArray.map((index) => {
        return test.mondai[index];
    });

    return mondaiArray;
};

export const getRandomNumbersSimple = (ammount: number, size: number) => {
    let randomNumbersArray = [] as number[];

    while (randomNumbersArray.length < ammount) {
        let number = randomInt(0, size - 1);

        //si randomNumbersArray no contiene
        if (!randomNumbersArray.includes(number)) {
            randomNumbersArray.push(number);
        }
    }

    randomNumbersArray.sort((a, b) => a - b);

    return randomNumbersArray;
};

export const chooseThreeDrag = (test: Test, randomNumberArray: number[]) => {
    let dragArray = [];

    dragArray = randomNumberArray.map((index) => {
        return test.dragDrop[index];
    });

    return dragArray;
};
