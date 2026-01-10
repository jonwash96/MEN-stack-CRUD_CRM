const prompt = require('prompt-sync')();
const Customer = require('./models/Customer.js');
require('./db/connection.js');

//* VAR
let action;

//* DATA
let customers;
// const customers = [
//         { id: '658226acdcbecfe9b99d5421', name: "Matt", age: 43, update: Number },
//         { id: '65825d1ead6cd90c5c430e24', name: "Vivienne", age: 6, update: Number },
//         { id: '658226acdcbecfe9b99d5422', name: "Sarah", age: 29, update: Number },
//         { id: '65825d1ead6cd90c5c430e25', name: "John", age: 35, update: Number },
//         { id: '658226acdcbecfe9b99d5423', name: "Emily", age: 22, update: Number },
//         { id: '65825d1ead6cd90c5c430e26', name: "Michael", age: 50, update: Number },
//         { id: '658226acdcbecfe9b99d5424', name: "Sophia", age: 18, update: Number },
//         { id: '65825d1ead6cd90c5c430e27', name: "David", age: 40, update: Number },
//         { id: '658226acdcbecfe9b99d5425', name: "Olivia", age: 31, update: Number },
//         { id: '65825d1ead6cd90c5c430e28', name: "James", age: 27, update: Number }
//     ];
    
    
//* FUNC
const getCustomers = async () => customers = await Customer.find({});
const exit = () => console.log("press '^C' to exit.");

async function selectAction() {
    await getCustomers();
    console.log("\nWelcome to the CRM\nType 'q' to Quit\nWhat would you like to do?");
    console.log("\n",
        1, " Create a customer\n",
        2, " View all customers\n",
        3, " Update a Customer\n",
        4, " Delete a customer\n",
        5, " quit",
        "\n"
    );

    action = prompt("Type the number of the action you want to run. ");
    if (action === 'q') return exit();

    switch (action) {
        case '1':
        case 'create': {return create()}; break;
        case '2':
        case 'read': {return read()}; break
        case '3':
        case 'update': {return update()}; break;
        case '4':
        case 'delete': {return deleteCustomer()}; break;
    };
}

async function create() {
    let newCustomers = [];
    console.log("\nEnter a new customer in CSV format: <id>, <name>, <age>\n Separate each field by comma.\n Do not include labels (i.e. id:, name:).\n Do not wrap names in quotes.\n Use ';' to separate each new customer.\nIf you prefer a prompt for each field, type 'p'.\nType 'q' to Quit");
    let input = prompt("New Customers: ");
    if (input === 'q') return exit();

    if (input === 'p') {
        let run = true;
        while (run) {
            const newCustomer = {};
            // newCustomer['id'] = prompt("Customer Id: ");
            newCustomer['name'] = prompt("name: ");
            newCustomer['age'] = prompt("age: ");
            newCustomer['updated'] = Date.now();
            console.log(newCustomer, "\n");

            const confirmation = prompt("Is all the information correct? Type 'q' to Quit. Type 'y' for yes, 'n' for no. ");
            if (confirmation === 'q') return exit();
            if (confirmation === 'y') {
                customers.push(newCustomer);
                console.log("Do you have more customers to add?");
                const loop = prompt("Type 'y' for yes, or 'q' to Quit. ");
                if (loop === 'q') return exit();
                if (loop !== 'y') break;
            }
            else if (confirmation !== 'n') {
                while (true) {
                    const confirmationErr = prompt("Invalid Key Pressed! Type 'q' to Quit. Is all the information correct? Type 'y' for yes, 'n' for no. ");
                    if (confirmationErr === 'y') {
                        customers.push(newCustomer);
                        console.log(newCustomer);
                        run = false;
                    };
                    if (confirmationErr === 'n') break;
                    if (confirmationErr === 'q') return exit();
                }
            }
        };
    } else {
        let run = true;
        while (run) {
            const array = input.split(';');
            if (array[0].match(/\w+\:\s?['"]?\w+['"]?,?/g)) {
                array.forEach(obj => {
                    const newObj = {};
                    const noBrackets = obj.replaceAll(/[\{\}]/g, '');
                    console.log("NO BRACKETS", noBrackets);
                    noBrackets.split(',').forEach(pair => {
                        const bits = pair.split(':');
                        newObj[bits[0].trim().replaceAll(/['"]/g, '')]
                            = bits[1].trim().replaceAll(/['"]/g, '');
                    });
                    newObj['updated'] = Date.now();
                    newCustomers.push(newObj);
                });
            } else {
                array.forEach(line => {
                    const bits = line.split(',');
                    newCustomers.push(Object({
                        // id: bits[0].trim(),
                        name:bits[0].trim(),
                        age: bits[1],
                        update: Date.now(),
                    }))
                });
            }
            console.log("\n", newCustomers, "\nCreating "+newCustomers.length + " New Customers.\n");
            input = prompt("Does the above information look correct? Type 'y' for yes, 'n' for no, or 'q' to Quit. ");
            if (input==='q') {return;
            } else if (input==='y') {break;
            } else if (input==='n') {newCustomers = []; input = prompt("New Customers: ");
            } else {
                while (run) {
                    const confirmationErr = prompt("Invalid Key Pressed! Type 'q' to Quit. Is all the information correct? Type 'y' for yes, 'n' for no. ");
                    if (confirmationErr==='q') return exit();
                    if (confirmationErr === 'y') run = false;
                    if (confirmationErr==='n') return(create());
                }
            }
        };

        await newCustomers.forEach(customer => {
            Customer.create(customer);
        });
        customers.push(...newCustomers);
        newCustomers = [];
    };

    input = prompt("Do you have more to add? Type 'y' for yes, or 'enter' to return to the menu, or 'q' to Quit. ")
    if (input === 'q') return exit();
    if (input === 'y') return(create());

    selectAction();
}

async function read() {
    // customers = await Customer.find({});
    await getCustomers();
    let input, foundCustomer;
    let list = [];
    const last5Customers = customers.sort((a, b) => a.updated + b.updated);

    console.log("\n5 Most recently update customers.");
    for (let i = 0; i < 5; i++) {
        list.push(last5Customers[i]);
        if (!last5Customers[i]) break;
        console.log(i + 1, "id: " + last5Customers[i].id, "name: " + last5Customers[i].name, "age: " + last5Customers[i].age);
    }

    console.log("\nTo see all customers, type 'a' or 'all'.\nTo inspect a specific customer, type the number or enter a customerID.");
    input = prompt("Type 'q' to Quit. To return to the main menu, type any other key. ");
    if (input === 'q') return exit();

    if (/^a$|^all$/i.test(input)) {
        list = [];
        console.log("\nAll Customers:");
        for (let i = 0; i < customers.length; i++) {
            list.push(customers[i]);
            console.log(i + 1, "id: ", customers[i].id, "name: ", customers[i].name, "age: ", customers[i].age);
        };
        console.log("\nTo inspect a specific customer, type the number or enter a customerID.");
        input = prompt("Type 'q' to Quit. To return to the main menu, type 'n'. ");
        if (input === 'q') return exit();
        if (input === 'n') return selectAction();
    };

    while (true) {
        if (list[input - 1] || customers.find(customer => customer.id === input)) break;
        console.log("\nNot found! Select the number of the customer you want to update, or paste in the customerID.\nType 'q' to Quit or 'a' to view all.")
        input = prompt("Number or customerID: ");
        if (input === 'q') return exit();
        if (input==='a') return read();
    };

    input.length <= 3
        ? foundCustomer = customers.find(customer => customer.id === list[input -1].id)
        : foundCustomer = customers.find(customer => customer.id === input);

    console.log("\n", foundCustomer);
    // console.log("\nActions:", 1, "Update Customer", 2, "Delete Customer", 3, "View All Customers");
    input = prompt("\nType 'q' to Quit, 'a' to view all customers, or 'enter' to return to the main menu. ");
    switch (input) {
        case '1': update(foundCustomer.id); break;
        case '2': deleteCustomer(foundCustomer.id); break;
        case 'a': 
        case '3': read(); break;
        case 'q': return exit(); break;
    };
    return selectAction();
}

async function update() {
    await getCustomers();
    let input, foundCustomer;
    let list = [];
    const last5Customers = customers.sort((a, b) => a.updated + b.updated);

    console.log("\n5 Most recently update customers.");
    for (let i = 0; i < 5; i++) {
        if (!customers[i]) break;
        list.push(last5Customers[i]);
        console.log(i + 1, "id: " + last5Customers[i].id, "name: " + last5Customers[i].name, "age: " + last5Customers[i].age);
    }

    console.log("\nSelect the number of the customer you want to update, or paste in the customerID of any customer.\nTo see all customers, type 'a' or 'all'\nType 'q' to Quit.");
    input = prompt("Number or CustomerID: ");
    if (input === 'q') return exit();

    if (/^a$|^all$/i.test(input)) {
        list = [];
        console.log("\nAll Customers:");
        for (let i = 0; i < customers.length; i++) {
            list.push(last5Customers[i]);
            console.log(i + 1, "id: ", last5Customers[i].id, "name: ", last5Customers[i].name, "age: ", last5Customers[i].age);
        };
        input = prompt("\nSelect the number of the customer you want to update, or paste in the customerID. ");
        if (input === 'q') return exit();
    };


    while (true) {
        if (list[input - 1] || customers.find(customer => customer.id === input)) break;
        console.log("Not found! Select the number of the customer you want to update, or paste in the customerID.\nType 'q' to Quit.")
        input = prompt("Number or customerID: ");
        if (input === 'q') return exit();
    };

    input.length <= 3
        ? foundCustomer = customers.find(customer => customer.id === list[input -1].id)
        : foundCustomer = customers.find(customer => customer.id === input);

    console.log(`\nUpdate ${JSON.stringify(foundCustomer)}?`);
    const geaux = prompt("Type 'y' for yes, 'n' for no, or type 'q' to Quit. ");
    if (input === 'q') return exit();

    if (geaux === 'y') {
        let run = true;
        let updatedCustomer = {};
        while (run) {
        console.log("\nEnter the information you want to update as key-value pairs in CSV format.\nIf you prefer a prompt for each field, type 'p'\nFormat = id:<customerID>, name:<customername>, age:<age>");
        const result = prompt("update Information: ");

            if (result === 'p') {
                console.log("\nEnter new information for each field, or leave unchanged.")
                // updatedCustomer['id'] = prompt("id: ", foundCustomer.id);
                updatedCustomer['name'] = prompt("name: ", foundCustomer.name);
                updatedCustomer['age'] = prompt("age: ", foundCustomer.age);
            } else {
                updatedCustomer = Object.create(foundCustomer);
                if (result.includes(',')) {
                    result.split(',').forEach(pair => {
                        const bits = pair.split(':');
                        bits.forEach(bit => {
                            updatedCustomer[bits[0].trim()] = bits[1].trim();
                        })
                    });
                } else {
                    const bits = result.split(':').map(bit => bit.trim());
                    updatedCustomer[bits[0]] = bits[1];
                }
            };
            
            updatedCustomer.updated = Date.now();
            console.log("\n", updatedCustomer);
    
            input = prompt("Does the above information look correct? Type 'y' for yes, 'n' for no, or 'q' to Quit. ");
            if (input==='q') {return;
            } else if (input==='y') {break;
            } else if (input==='n') {null;
            } else {
                while (run) {
                    const confirmationErr = prompt("Invalid Key Pressed! Type 'q' to Quit. Is all the information correct? Type 'y' for yes, 'n' for no. ");
                    if (confirmationErr==='q') return exit();
                    if (confirmationErr === 'y') run = false;
                    if (confirmationErr==='n') break;
                }
            }
        };
        foundCustomer = updatedCustomer;
        Customer.findByIdAndUpdate(updatedCustomer.id, updatedCustomer);

    } else {
        console.log("Aborted! Please try a new search.");
        update();
    };

    selectAction();
}

async function deleteCustomer() {
    await getCustomers();
    let input, foundCustomer;
    let list = [];
    const last5Customers = customers.sort((a, b) => a.updated + b.updated);

    console.log("\n5 Most recently update customers.");
    for (let i = 0; i < 5; i++) {
        if (!customers[i]) break;
        list.push(last5Customers[i]);
        console.log(i + 1, "id: " + last5Customers[i].id, "name: " + last5Customers[i].name, "age: " + last5Customers[i].age);
    }

    console.log("\nSelect the number of the customer you want to delete, or paste in the customerID of any customer.\nTo see all customers, type 'a' or 'all'. Type 'q' to Quit.");
    input = prompt("Number or CustomerID: ");
    if (input === 'q') return exit();

    if (/^a$|^all$/i.test(input)) {
        list = [];
        console.log("\nAll Customers:");
        for (let i = 0; i < customers.length; i++) {
            list.push(last5Customers[i]);
            console.log(i + 1, "id: ", last5Customers[i].id, "name: ", last5Customers[i].name, "age: ", last5Customers[i].age);
        }
        input = prompt("Select the number of the customer you want to delete, or paste in the customerID. ");
        if (input === 'q') return exit();
    };


    while (true) {
        if (list[input - 1] || customers.find(customer => customer.id === input)) break;
        console.log("Not found! Select the number of the customer you want to delete, or paste in the customerID.\nType 'q' to Quit.")
        input = prompt("Number or customerID: ");
        if (input === 'q') return exit();
    };

    input.length <= 3
        ? foundCustomer = customers.find(customer => customer.id === list[input - 1].id)
        : foundCustomer = customers.find(customer => customer.id === input);

    console.log(`\nDelete ${JSON.stringify(foundCustomer)}?`);
    const geaux = prompt("Type 'y' for yes, 'n' for no, or type 'q' to Quit.");
    if (input === 'q') return exit();

    if (geaux === 'y') {
        customers.splice(customers.findIndex(customer => customer.id === foundCustomer.id), 1);
        const deleteStatus = await Customer.findByIdAndDelete(foundCustomer.id);
        console.log("\nDELETED:\n", deleteStatus);
    } else {
        console.log("Aborted! Please try a new search.");
        deleteCustomer();
    };

    selectAction();
}

//* RUN
selectAction();