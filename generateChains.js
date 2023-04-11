const fs = require("fs")
const path = require("path")

const dir = "./constants/chains"
const chains = []

const main = async () => {
    fs.readdir(dir, (err, list) => {
        for (let i = 1; i < list.length; i++) {
            let chain = JSON.parse(fs.readFileSync(dir + "/" + list[i], "utf-8"))
            chains.push(chain)
        }
        fs.writeFileSync(dir + "/" + "chains.json", JSON.stringify(chains))
        console.log("Generated chains.json")
    })
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
