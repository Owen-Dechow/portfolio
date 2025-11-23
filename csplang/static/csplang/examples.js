// @ts-check

export const examplePrograms = {
    HelloWorld: `// The CSP Pseudocode Runner is an interactive environment designed to run and experiment with AP
//   CSP pseudocode as outlined in the College Board specification. It integrates a lightweight
//   editor and interpreter that handle CSP’s unique syntax, special characters, and dynamic
//   typing rules. Features such as autocomplete for uncommon symbols, make the sandbox
//   approachable for students in AP Computer Science Principals.

// Language Specifications: https://apcentral.collegeboard.org/media/pdf/ap-computer-science-principles-exam-reference-sheet.pdf

// Course Overview: https://apcentral.collegeboard.org/courses/ap-computer-science-principles

// Built and maintained by Owen Dechow

// FOR FURTHER INFORMATION, PLEASE READ THE "Justification of Implementation" LINKED ABOVE.

DISPLAY("Hello, World!")
`,
    Empty: ``,
    CalcAverage: `PROCEDURE calculateAverage(list_of_numbers) {
    sum_of_numbers ← 0
    num_elements ← LENGTH(list_of_numbers)

    IF (num_elements = 0) {
        RETURN 0 // Handle empty list case
    }

    FOR EACH number IN list_of_numbers {
        sum_of_numbers ← sum_of_numbers + number
    }

    average ← sum_of_numbers / num_elements
    RETURN average
}

// Main program execution
numbers_list ← [10, 20, 30, 40, 50]
result_average ← calculateAverage(numbers_list)
DISPLAY("The average of the numbers is: ")
DISPLAY(result_average)

empty_list ← []
result_empty_average ← calculateAverage(empty_list)
DISPLAY("The average of an empty list is: ")
DISPLAY(result_empty_average)
`,
};
