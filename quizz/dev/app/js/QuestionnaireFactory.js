export default class QuestionnaireFactory {
    constructor() {

    }

    buildQuestionnaire(level, askedSize) {
        let base = [];
        let questionnaire = [];
        switch (level) {
            case "hard" :
                base.push(...questionBase.hard);
            case "medium":
                base.push(...questionBase.medium);
            default:
                base.push(...questionBase.easy);
        }
        let size = Math.min(base.length,askedSize);
        for (let index = 0; index < size; index++) {
            let randomIndex = Math.floor(Math.random() * Math.floor(base.length));
            questionnaire.push(base[randomIndex]);
            base.splice(randomIndex,1);
        }
        return questionnaire;
    }


}

const questionBase = {
    easy:[
        {
            text:"True && True",
            answer:true
        },
        {
            text:"True && False",
            answer:false
        },
        {
            text:"False && True",
            answer:false
        },
        {
            text:"False && False",
            answer:false
        },
        {
            text:"True || True",
            answer:true
        },
        {
            text:"True || False",
            answer:true
        },
        {
            text:"False || True",
            answer:true
        },
        {
            text:"False || False",
            answer:false
        }
    ],
    "medium":[
        {
            text:"!True && True",
            answer:false
        },
        {
            text:"!True && False",
            answer:false
        },
        {
            text:"!False && True",
            answer:true
        },
        {
            text:"!False && False",
            answer:false
        },
        {
            text:"!True || True",
            answer:true
        },
        {
            text:"!True || False",
            answer:false
        },
        {
            text:"!False || True",
            answer:true
        },
        {
            text:"!False || False",
            answer:true
        },
        {
            text:"True && !True",
            answer:false
        },
        {
            text:"True && !False",
            answer:true
        },
        {
            text:"False && !True",
            answer:false
        },
        {
            text:"False && !False",
            answer:false
        },
        {
            text:"True || !True",
            answer:true
        },
        {
            text:"True || !False",
            answer:true
        },
        {
            text:"False || !True",
            answer:false
        },
        {
            text:"False || !False",
            answer:true
        }
    ],
    "hard":[
        {
            text:"True || !(True && True)",
            answer:true
        },
        {
            text:"True && !(True || False)",
            answer:false
        },
        {
            text:"False && True",
            answer:false
        },
        {
            text:"False && False",
            answer:false
        },
        {
            text:"True || True",
            answer:true
        },
        {
            text:"True || False",
            answer:true
        },
        {
            text:"False || True",
            answer:true
        },
        {
            text:"False || False",
            answer:false
        }
    ]
}