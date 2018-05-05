export module RandomGenerator {

    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const numberes = "0123456789";
    const specialSymbols = "~!@#$%^&*()_-+={}[]\|:;<>,.?/";

    export function generate(length: number = 10): string {
        var possible = upperCase + lowerCase + numberes;
        return generateByPossible(length, possible);
    }

    export function generateEmail() {
        //add date time for uniq
        return this.generateOnlyLetters(2) + Date.now().toString() + '@' + this.generateOnlyLetters(2) + this.generate(3) + '.' + this.generateLowerCase(2);
    }

    export function generateLowerCase(length: number): string {
        return this.generateByPossible(length, lowerCase);
    }

    export function generateUpperCase(length: number): string {
        return this.generateByPossible(length, upperCase);
    }

    export function generateOnlyLetters(length: number): string {
        return this.generateByPossible(length, upperCase + lowerCase);
    }

    export function generateOnlyNumbers(length: number): string {
        return this.generateByPossible(length, numberes);
    }

    export function generateLowerCaseAndNumbers(length: number): string {
        return this.generateByPossible(length, lowerCase + numberes);
    }

    export function generateUpperCaseAndNumbers(length: number): string {
        return this.generateByPossible(length, upperCase + numberes);
    }

    export function generateByPossible(length: number, possible: string): string {
        var result = "";
        for (var i = 0; i < length; i++)
            result += possible.charAt(Math.floor(Math.random() * possible.length));

        return result;
    }
}