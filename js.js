const arr = ["", "", "", ""];
let count = 0;
console.log(
    arr.some((elem) => {
        console.log(count++);
        return elem?.trim() === "";
    })
);
console.log(arr[0]?.trim());
