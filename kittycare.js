// Node.js CLI kitty game!!!! MEOWWWWW!!!!

const readline = require("readline");
const fs = require("fs");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

// let's define it before anything, so it doesn't go local
var data;

var kitties = [];
var inventory = [];
var money = 0;
var filename = "devsave";
var exitMsg = "";
var uiSect = "init";

// here are thy fur colors for thee, they're beautiful
const furColors = {
  common: [
    "White",
    "Grey",
    "Tan",
    "Silver",
    "Brown",
    "Black",
    "Orange",
    "Cream",
  ],
  rare: ["Yellow", "Red", "Pastel Pink", "Pastel Purple", "Pastel Blue"],
  epic: ["Gold", "Chrome", "Pastel Aqua"],
  super: ["Turquoise", "Diamond", "Lava Red"],
  immortal: ["Angellic White", "Spirit Grey", "Demonic Black"],
  god: ["God Gold", "God White"],
};
// here are item definitions, that's my cake down there.. no, it's not the baked kind
// ["name", [+hunger, +power, +lust, +maxhunger], [[Extra status names], [Extra status day duration]]]
const itemStats = [
  ["cat food", [25, 0, 0, 0]],
  ["dog food", [5, 0, 0, 0], [["identity crisis"], [2]]],
  ["raw meat", [15, 0, 5, 0]],
  ["horny kit's hershey kisses", [20, 0, 65, 0], [["horny"], [2]]],
  ["ramses' flesh", [690, 20, 30, 30], [["violent"], [7]]],
  [
    "shimple's cake",
    [69420, 42069, 21420, 42069],
    [
      ["wet", "horny"],
      [99, 99],
    ],
  ],
];

// here are some symbols, to fancy your ui's
const symbols = {
  ul: "\u{2554}",
  ur: "\u{2557}",
  dl: "\u{255A}",
  dr: "\u{255D}",
  lr: "\u{2551}",
  ud: "\u{2550}",
  star: "\u{1F7B4}",
  circledCross: "\u{2BBF}",
  cross: "\u{1F7AE}",
};

// Here's the kitty factory
class kitty {
  constructor(name, age, hunger, maxhunger, power, lust) {
    this.name = name;
    this.age = age;
    this.hunger = hunger;
    this.maxhunger = maxhunger;
    this.rawPower = power;
    // so, raw power is.. raw, without modifications, here we make changes so it's a bit less "static"
    this.power =
      rawpower -
      (this.status.includes("wet") || this.status.includes("horny")
        ? 20 / rawpower
        : 0) -
      // First, we lower their power if they're "wet" or "horny"
      (this.maxhunger - this.hunger + this.lust) * 0.6 +
      // Then we lower it further with the difference between their max hunger and hunger
      // and their lust too
      (this.status.includes("violent")
        ? 3 + this.durations[this.status.indexOf("violent")] * 4
        : 0);
    // And finally, we add more if they're "violent"
    this.lust = lust;
    this.status = [];
    this.durations = [];
    this.battleDif = 0;
    while (!this.furcolor) {
      this.furcolor = furColor();
    }
  }
}
// Here we calculate the fur color of our little kitties
function furColor() {
  return Math.random() < 0.1
    ? Math.random() < 0.1
      ? Math.random() < 0.1
        ? Math.random() < 0.1
          ? Math.random() < 0.1
            ? furColors["god"][
                Math.floor(Math.random() * furColors["god"].length)
              ]
            : furColors["immortal"][
                Math.floor(Math.random() * furColors["immortal"].length)
              ]
          : furColors["super"][
              Math.floor(Math.random() * furColors["super"].length)
            ]
        : furColors["epic"][
            Math.floor(Math.random() * furColors["epic"].length)
          ]
      : furColors["rare"][Math.floor(Math.random() * furColors["rare"].length)]
    : furColors["common"][
        Math.floor(Math.random() * furColors["common"].length)
      ];
}

// Init function
function newGame() {
  kitties = [];
  inventory = [];
  money = 30;
  rl.question("Name your kitty\n (owo) |> ", (ans) => {
    let newKit = new kitty(String(ans), 1, 100, 100, 20, 0);
    kitties.push(newKit);
    console.clear();
    kittyMenu();
  });
}

function kittyMenu() {
  console.clear();
  console.log(symbols["ul"]);
  console.log(`${symbols["lr"]}[ Kitties: ${kitties.length}]`);
  console.log(symbols["lr"]);
  for (let i = 0; i < kitties.length; i++) {
    console.log(
      `${symbols["lr"]}${i + 1}${kitties[i].status == "idle" ? symbols["star"] : symbols["circledCross"]}> ${kitties[i].name}, ${kitties[i].age} ${kitties[i].age == 1 ? "day" : "days"} old`,
    );
    console.log(
      `${symbols["lr"]}${" ".repeat(i.toString().length)}${symbols["ul"]}  hunger: ${kitties[i].hunger}/${kitties[i].maxhunger}`,
    );
    console.log(
      `${symbols["lr"]}${" ".repeat(i.toString().length)}${symbols["lr"]}  power: ${kitties[i].power}`,
    );
    console.log(
      `${symbols["lr"]}${" ".repeat(i.toString().length)}${symbols["dl"]}  lust: ${kitties[i].lust}`,
    );
    console.log(symbols["lr"]);
  }
  console.log(symbols["lr"], " [B] Battle");
  console.log(symbols["lr"], " [I] Inventory");
  console.log(symbols["lr"], " [T] Train");
  console.log(symbols["lr"], " [C] Check");
  console.log(symbols["lr"], " [N] Next day");
  console.log(symbols["lr"], " [F] Feed");
  console.log(symbols["lr"], " [S] Shop");
  console.log(symbols["dl"], " [M] Menu");
  rl.question("\n\n| |> ", (ans) => {
    let filteredAns = filter(ans);
    if (filteredAns == "b" || filteredAns == "battle") {
      toBattle();
    } else if (filteredAns == "i" || filteredAns == "inventory") {
    } else if (filteredAns == "t" || filteredAns == "train") {
    } else if (filteredAns == "c" || filteredAns == "check") {
    } else if (
      filteredAns == "n" ||
      filteredAns == "nd" ||
      filteredAns == "next" ||
      filteredAns == "next day"
    ) {
      nextDay();
      kittyMenu();
    } else if (filteredAns == "f" || filteredAns == "feed") {
      feedMenu();
    } else if (filteredAns == "s" || filteredAns == "shop") {
    } else if (filteredAns == "m" || filteredAns == "menu") {
      fileMenu();
    } else {
      console.log(symbols["star"], "Invalid option:", ans);
      setTimeout(() => {
        kittyMenu();
      }, 800);
    }
  });
}

function toBattle() {
  console.log(
    symbols["star"],
    "Select a kitty [0" +
      (kitties.length > 1 ? "-" + kitties.length : "") +
      "]",
  );
  rl.question("| |> ", (kit) => {
    kitties[kit].status = "battling";
    kitties[kit].phase = 3;
    rl.question(
      `\nEnter difficulty\n [0-${kitties[kit].power / 4}] | |> `,
      (dif) => {
        kitties[kit].battleDif = Math.min(
          kitties[kit].power / 4,
          Math.max(0, dif),
        );
        console.log("Dificulty set to", kitties[kit].battleDif);
        setTimeout(() => {
          kittyMenu();
        }, 800);
      },
    );
  });
}

function nextDay() {
  for (let i = 0; i < kitties.length; i++) {
    if (kitties[i].status == "idle") {
      kitties[i].hunger -= 5;
    } else if (kitties[i].status == "battling") {
      if (kitties[i].phase != 0) {
        kitties[i].phase--;
      } else {
        kitties[i].rawpower += 10 + kitties[i].battleDif * 3;
        kitties[i].hunger -= Math.max(10, kitties[i].battleDif * 5);
        kitties[i].status = "idle";
      }
    }
    kitties[i].age++;
  }
}

function feedMenu() {
  console.log(
    symbols["star"],
    "Select a kitty [0" +
      (kitties.length > 1 ? "-" + kitties.length : "") +
      "]",
  );
  rl.question("| |> ", (kit) => {
    kitties[kit].status = "battling";
    kitties[kit].phase = 3;
    rl.question(
      `\nEnter difficulty\n [0-${kitties[kit].power / 4}] | |> `,
      (dif) => {
        kitties[kit].battleDif = Math.min(
          kitties[kit].power / 4,
          Math.max(0, dif),
        );
        console.log("Dificulty set to", kitties[kit].battleDif);
        setTimeout(() => {
          kittyMenu();
        }, 800);
      },
    );
  });
}

function filter(str) {
  return str.toLowerCase().replaceAll("/[^a-zA-Z]/", "");
}

function load(fn) {
  fs.readFile(fn + ".json", (e, d) => {
    if (e) {
      console.log("Couldn't find file " + fn + ".json");
      newGame();
    } else {
      kitties = JSON.parse(d)[0];
      inventory = JSON.parse(d)[1];
      money = JSON.parse(d)[2];
      filename = fn;
      kittyMenu();
    }
  });
}
function save(fn, m) {
  if (uiSect != "init") {
    let data = [];
    data.push(kitties);
    data.push(inventory);
    data.push(money);
    if (m) {
      // Use sync for exit handler to ensure data is written before process ends
      fs.writeFileSync(fn + ".json", JSON.stringify(data));
      filename = fn;
    } else {
      // Use async for normal saves
      fs.writeFile(fn + ".json", JSON.stringify(data), (err) => {
        if (err) {
          throw err;
        } else {
          filename = fn;
        }
      });
    }
    if (!m) {
      kittyMenu();
    }
  }
}

function handleSaves(ans, menu) {
  console.log("\n");
  let filteredAns = filter(ans);
  if (filteredAns == "new") {
    newGame();
  } else if (filteredAns == "load" || filteredAns == "l") {
    rl.question("filename: ", (fn) => {
      fn ? load(fn) : load(filename);
    });
  } else if ((filteredAns == "save" || filteredAns == "s") && menu == "main") {
    rl.question("filename: ", (fn) => {
      fn ? save(fn) : save(filename);
    });
  } else if (
    filteredAns == "exit" ||
    filteredAns == "e" ||
    filteredAns == "q"
  ) {
    rl.close();
    process.exit(0);
  } else {
    console.log(
      "Oops! You apparently have paws because you entered something invalid: ",
      ans,
      "\n",
    );
    exitMsg = "Invalid option selected";
    rl.close();
    process.exit(1);
  }
}

function fileMenu() {
  rl.question(
    `
[NEW] create a new game
[LOAD] load a saved game
[SAVE] save this game
[EXIT] exit & save the game

|> `,
    (ans) => {
      handleSaves(ans, "main");
    },
  );
}

function main() {
  // Kitty art!
  console.clear();
  console.log(`
  /\\_/\\  
 ( o.o ) 
  > ^ <   Welcome to the Kitty Game!
`);
  rl.question(
    `Select one of the two options...

[NEW] create a new game
[LOAD] load a saved game
[EXIT] exit the game
    
|> `,
    (ans) => {
      handleSaves(ans, "init");
      uiSect = "ingame";
    },
  );
}

process.on("exit", (code) => {
  console.clear();
  save(filename, true);
  console.log(`    Goodbye! Nya-nya!
${kitties.length == 1 ? ` Your ${kitties.length} kitty is saved!` : kitties.length == 0 ? `No kitties were present here to be saved!` : `Your ${kitties.length} kitties are saved!`}
  Enjoy your day, uwu!
`);
  if (code == 1) {
    console.log("Though your kitties sense something went wrong..");
    console.log(symbols["cross"], exitMsg, "\n");
  }
});

rl.on("SIGINT", () => {
  rl.close();
  process.exit(0);
});

main();
