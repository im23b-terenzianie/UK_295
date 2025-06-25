
i=2;
total=0;
while (process.argv.length > i) {
    total += Number(process.argv[i])
    i++
};
console.log(total)

