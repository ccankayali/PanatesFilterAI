/* eslint-disable prettier/prettier */
export class AiModule {
    getAnswer(question: string): string | PromiseLike<string> {
        if(question === "How are you?") {
            return "I'm good, thank you!";
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve("This is an async answer to your question."), 1000);
        });
    }
}

// ! DÜZENELENECEK