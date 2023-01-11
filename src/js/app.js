import ItemGenerator from "./components/itemGenerator.js";
import VendingMachine from "./components/vendingmachine.js";

const itemGenerator = new ItemGenerator();
const vendingMachine = new VendingMachine();

await itemGenerator.setup();
vendingMachine.setup();
