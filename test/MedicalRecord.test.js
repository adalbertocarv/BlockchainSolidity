const { expect } = require("chai");
const { ethers } = require("hardhat");
const { user } = require("pg/lib/defaults");

describe("MedicalRecord", () => {
    let medical, user1, transactionResponse, transactionReceipt;
    beforeEach(async () => {
        const accounts = await ethers.getSigners();
        user1 = accounts[1];
        const Medical = await ethers.getContractFactory("MedicalRecord");
        medical = await Medical.connect(user1).deploy();
    });
    describe("Deployed", ()=>{
        it("O contrato foi implementado com sucesso",async()=>{
            expect(await medical.address).to.not.equal(0);
        });
    });
    describe("Add record",()=>{
        beforeEach(async()=>{
            transactionResponse=await medical
            .connect(user1)
            .addRecord(       
            "Pedro",
            22,
            "Male",
            "B positive",
            "Dengue",
            "Dengue",
            "Dengue"
            );
            transactionReceipt = await transactionResponse.wait();
        });
        it("Emits an Add record event", async () => {
            // Verifica se há eventos no recibo de transação
            if (!transactionReceipt.events || transactionReceipt.events.length === 0) {
                console.log("Nenhum evento foi emitido.");
            } else {
                // Procura o evento específico "MedicalRecord__AddRecord"
                const event = transactionReceipt.events.find(e => e.event === "MedicalRecord__AddRecord");
                
                // Garante que o evento foi encontrado
                expect(event).to.not.be.undefined;
                
                // Verifica se o evento é o correto
                expect(event.event).to.equal("MedicalRecord__AddRecord");
        
                // Realiza as outras verificações, caso necessário
                const args = event.args;
                expect(args.timestamp).to.not.equal(0);
                expect(args.name).to.equal("Pedro");
                expect(args.age).to.equal(22);
                expect(args.gender).to.equal("Male");
                expect(args.bloodType).to.equal("B positive");
                expect(args.allergies).to.equal("Dengue");
                expect(args.diagnosis).to.equal("Dengue");
                expect(args.treatment).to.equal("Dengue");
            }
        });
        it("The getRecord function is workin properly or not",async()=>{
            const[
                timestamp,
                name,
                age,
                gender,
                bloodType,
                allergies,
                diagnosis,
                treatment
            ]=await medical.getRecord(1);
            expect(await medical.getRecordId()).to.be.equal(1);
            expect(timestamp).to.not.equal(0);
            expect(name).to.equal("Pedro");
            expect(age).to.equal(22);
            expect(gender).to.equal("Male");
            expect(bloodType).to.equal("B positive");
            expect(allergies).to.equal("Dengue");
            expect(diagnosis).to.equal("Dengue");
            expect(treatment).to.equal("Dengue");
        });
    });
    describe("Delete", () => {
        beforeEach(async() => {
            transactionResponse=await medical
            .connect(user1)
            .addRecord(       
            "Pedro",
            22,
            "Male",
            "B positive",
            "Dengue",
            "Dengue",
            "Dengue"
        );
    transactionReceipt = await transactionResponse.wait();
    transactionResponse = await medical.connect(user1).deleteRecord(1);
    transactionReceipt = await transactionResponse.wait();
    });
    it("The record is presnet in the isdelete mapping", async() => {
        expect(await medical.getDeleted(1)).to.be.equal(true);
    });
    it("It emits a delete event or not", async () => {
        if (!transactionReceipt.events || transactionReceipt.events.length === 0) {
            console.log("Nenhum evento foi emitido.");
        } else {
            const event = transactionReceipt.events.find(e => e.event === "MedicalRecord__DeleteRecord");
            
            // Garante que o evento foi encontrado
            expect(event).to.not.be.undefined;
            
            // Verifica se o evento é o correto
            expect(event.event).to.equal("MedicalRecord__DeleteRecord");
            const args = event.args;
            expect(event.event).to.equal("MedicalRecords__DeleteRecord");
            expect(args.timestamp).to.not.equal(0);
            expect(args.name).to.equal("Wastron");
            expect(args.age).to.equal(22);
            expect(args.gender).to.equal("Male");
            expect(args.bloodType).to.equal("B positive");
            expect(args.allergies).to.equal("Dengue");
            expect(args.diagnosis).to.equal("Dengue");
            expect(args.treatment).to.equal("Dengue");
            }
    });
});
});