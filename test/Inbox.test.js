const assert = require("assert");
const ganache = require("ganache");
const { Web3 } = require("web3");
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../compile")

let accounts;
let inbox;
const initialMessage = "Hi there"

beforeEach(async ()=> {
    accounts = await web3.eth.getAccounts();

    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: [initialMessage]})
        .send({from: accounts[0], gas: "1000000"})
})

describe("Inbox",() => {
    it("deploys a contract", () => {
        assert.ok(inbox.options.address);
    })

    it("has default message", async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, initialMessage)
    })
    it("has default message", async () => {
        const newMessage = 'Bye'
        await inbox.methods.setMessage(newMessage)
            .send({from: accounts[0]});
        const message = await inbox.methods.message().call();

        assert.equal(message, newMessage);
    })
});