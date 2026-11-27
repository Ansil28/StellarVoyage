// ROCKET GUIDE CONTENT
// One entry per data-topic value used by the guide cards in index.html.
// Each section can have "paragraphs" (shown first), a "list" and
// "after" (paragraphs shown after the list).
// List items are plain strings, or { term, text } for definition-style items.
// A section can also have an "image" ({ src, alt }), shown under its heading,
// and a "table" ({ headers: [...], rows: [[...], ...] }), shown at the end.
// "subheading: true" shows the heading smaller, as part of the section above.
// A topic can have its own "image" ({ src, alt }), shown after the intro.

const GUIDE_TOPICS = {
  history: {
    title: "A Brief History of Rocketry",
    // A long article: show an "On this page" index with a link to each section
    toc: true,
    intro: "The principle behind every rocket, that pushing something backwards pushes you forwards, has been understood for more than two thousand years. Turning it into a machine that can leave the Earth took eight centuries of fireworks, weapons, ridiculed scientists, a world war, a superpower race and, more recently, a handful of companies and student teams willing to fail until they succeeded. This is that story.",
    image: {
      src: "assets/guide/rocketry-history.svg",
      caption:
        "Eight centuries of rocketry in sixteen milestones, from fire arrows at Kaifeng to Artemis II. " +
        "The milestones are evenly spaced, not to scale.",
      alt:
        "Timeline of rocketry in six eras. Gunpowder rockets: 1232, fire arrows at the siege of Kaifeng; 1780s, Mysorean iron-cased war rockets in India; " +
        "1804, the Congreve rocket in Britain. The pioneers: 1903, Tsiolkovsky publishes the rocket equation; 1923, Hermann Oberth's The Rocket into Planetary Space; " +
        "1926, Robert Goddard's first liquid-fuel rocket flies. War and the Space Race: 1944, the V-2 is the first human-made object in space; " +
        "1957, Sputnik 1, the first satellite, launched by an R-7; 1961, Yuri Gagarin, the first human in orbit; 1969, the Saturn V and Apollo 11 Moon landing. " +
        "Shuttle era: 1981, the Space Shuttle, the first partly reusable crewed spacecraft. Commercial era: 2008, Falcon 1, the first private liquid rocket in orbit; " +
        "2015, Falcon 9, the first orbital-class booster landing. A new generation: 2019, Traveler IV, the first student-built rocket in space; " +
        "2020, EuRoC, a student rocketry challenge in Portugal; 2024, Starship's booster caught by its launch tower; 2026, Artemis II's crew flies around the Moon."
    },
    sections: [
      {
        heading: "1. Fire and gunpowder (c. 1000–1850)",
        paragraphs: [
          "The first rockets were Chinese. Gunpowder was invented in China around the 9th century, and by the 13th century it was being packed into bamboo or paper tubes tied to arrows. When lit, the burning powder pushed the arrow forward on its own: a simple solid rocket motor.",
          "The first well-documented use came in 1232, when the defenders of Kaifeng fired barrages of \"arrows of flying fire\" at Mongol armies besieging the city. Their military effect was probably more psychological than deadly, but the Mongols quickly adopted the idea and helped spread it west. By the late 14th century, rockets were being used in battles from China to Italy.",
          "For centuries, rockets remained inaccurate and short-ranged, because their cases were weak and could not hold much pressure (see Rocket Propulsion). That changed in the Kingdom of Mysore, in southern India. In the 1780s and 1790s, the armies of Hyder Ali and his son Tipu Sultan used rockets with iron casings. The stronger casing allowed a higher chamber pressure and a much longer range, and these rockets caused serious problems for British troops.",
          "After Tipu Sultan's defeat in 1799, captured Mysorean rockets were sent to Britain. Starting in 1804, William Congreve studied and improved them, creating the Congreve rocket, which was used by British forces in the Napoleonic Wars and the War of 1812. During the 1814 bombardment of Fort McHenry in Baltimore, they failed to take the fort, but they inspired the line \"the rockets' red glare\" in what became the United States national anthem.",
          "As artillery became more accurate and powerful during the 19th century, war rockets fell out of use. Rockets might have stayed a curiosity, but a few people had started to imagine using them for something very different."
        ]
      },
      {
        heading: "2. The pioneers (1890s–1930s)",
        paragraphs: [
          "At the turn of the 20th century, three people working separately laid the scientific foundations of spaceflight, inspired in part by the novels of Jules Verne and H. G. Wells.",
          "Konstantin Tsiolkovsky, a self-taught Russian schoolteacher, wrote \"Exploration of Outer Space by Means of Reaction Devices\" in 1898, and it was published in 1903. In it, he showed mathematically that a rocket could reach space, derived the rocket equation that still bears his name (see Rocket Fundamentals), and proposed liquid oxygen and liquid hydrogen as propellants. He also described multi-stage rockets. Because he wrote in Russian and worked in isolation, his ideas were almost unknown abroad for decades.",
          "In the United States, physicist Robert Goddard turned theory into hardware. In 1914 he patented a multi-stage rocket and a liquid-fuelled rocket, and in 1919 he published \"A Method of Reaching Extreme Altitudes\", which suggested that a rocket could one day reach the Moon. The New York Times mocked the idea in an editorial, claiming that a rocket could not work in a vacuum because it would have nothing to push against. Goddard was right: a rocket pushes against its own exhaust. The newspaper printed a correction in July 1969, while Apollo 11 was on its way to the Moon.",
          "On 16 March 1926, on a snowy farm in Auburn, Massachusetts, Goddard launched the world's first liquid-fuelled rocket, burning gasoline and liquid oxygen. The flight lasted 2.5 seconds, reached a height of 12.5 metres and ended in a cabbage patch 56 metres away. It looked unimpressive, but it proved that a liquid rocket could be controlled. Goddard went on to launch more than two dozen rockets, adding gyroscopic stabilisation and many other ideas still used today.",
          "In Europe, the Transylvanian-born German physicist Hermann Oberth reached similar conclusions independently. His doctoral thesis on rocket flight was rejected as too speculative, so in 1923 he published it as a book, \"Die Rakete zu den Planetenräumen\" (The Rocket into Planetary Space). It became hugely influential in Germany, led to the founding of amateur rocket societies and made Oberth an adviser on Fritz Lang's 1929 film \"Frau im Mond\" (Woman in the Moon), which is often credited with popularising the launch countdown. One of the young members of those rocket societies was Wernher von Braun."
        ]
      },
      {
        heading: "3. The V-2 (1930s–1945)",
        paragraphs: [
          "In the 1930s, the German army began funding rocket research as a long-range weapon, and von Braun became the technical leader of a large programme at Peenemünde, on the Baltic coast. Its main product was the A-4, later called the V-2: the world's first large liquid-fuelled rocket and first long-range ballistic missile.",
          "The V-2 brought together the key technologies of modern rockets for the first time: a powerful engine burning alcohol and liquid oxygen, supersonic aerodynamics, gyroscopic guidance and graphite vanes in the exhaust to steer it. On 20 June 1944, a V-2 test flight known as MW 18014 was launched vertically and reached an altitude of about 176 km. It was the first human-made object to reach space.",
          "The V-2's history is also deeply dark. From September 1944, more than 3,000 were launched against cities such as London and Antwerp, killing an estimated 9,000 people. Many more died building it: the rockets were assembled in the underground Mittelwerk factory by prisoners from the Mittelbau-Dora concentration camp, where conditions were brutal. More than twice as many prisoners died producing the V-2 than were killed by it in attacks.",
          "When the war ended, the United States and the Soviet Union raced to capture V-2 hardware and engineers. Von Braun and more than a hundred of his team surrendered to the Americans and were brought to the United States, while the Soviets took over the production facilities and many German specialists. Captured V-2s carried the first scientific instruments, cameras and animals to the edge of space, and the V-2 became the direct ancestor of both countries' rockets."
        ]
      },
      {
        heading: "4. The Space Race (1957–1975)",
        paragraphs: [
          "In the Soviet Union, the design bureau led by Sergei Korolev built the R-7, the world's first intercontinental ballistic missile, first flown successfully in August 1957. Designed to carry a heavy nuclear warhead, it was powerful enough to reach orbit. On 4 October 1957, an R-7 launched Sputnik 1, an 83.6 kg sphere that transmitted a simple radio beep. It was the first artificial satellite, and it started the Space Race. A month later, Sputnik 2 carried the dog Laika into orbit.",
          "The United States responded with Explorer 1 in January 1958, launched by von Braun's team, and created NASA that same year. But the Soviet Union kept the lead: on 12 April 1961, Yuri Gagarin became the first human in space, orbiting the Earth once in his Vostok capsule, launched by a version of the R-7. Weeks later, President John F. Kennedy committed the United States to landing a person on the Moon before the end of the decade.",
          "Reaching that goal required the Saturn V, still one of the most powerful rockets ever flown. Its first stage used five F-1 engines burning kerosene and liquid oxygen, producing about 34 meganewtons of thrust at liftoff, while its upper stages burned liquid hydrogen. It first flew on 9 November 1967, and on 16 July 1969 it launched Apollo 11. Four days later, Neil Armstrong and Buzz Aldrin walked on the Moon. The Saturn V flew 13 times, carried 24 astronauts to the Moon and never lost a crew or a payload. Its Soviet rival, the N1, failed on all four of its launch attempts, and the Soviet crewed Moon programme was cancelled.",
          "The race ended in cooperation: in 1975, an American Apollo and a Soviet Soyuz spacecraft docked in orbit."
        ]
      },
      {
        heading: "5. Workhorses and the Space Shuttle (1975–2011)",
        paragraphs: [
          "After the Moon landings, rockets became tools rather than symbols. The R-7 evolved into the Soyuz family, which is still flying today. Counting the R-7 and all its versions, it has flown more often than any other rocket family. Europe, determined to have its own access to space, created the Ariane programme: Ariane 1 first flew from French Guiana on 24 December 1979, and its successors made Europe a leader in commercial satellite launches. China, Japan and India also developed their own launchers.",
          "In the United States, NASA bet on reusability. The Space Shuttle first flew on 12 April 1981. Its winged orbiter returned to land on a runway, and its two solid rocket boosters were recovered from the sea, refurbished and flown again. Between 1981 and 2011, the Shuttle flew 135 missions, launched the Hubble Space Telescope and helped build the International Space Station.",
          "But it never delivered the cheap, frequent flights it promised. Refurbishing the orbiter between flights was slow and expensive, and its design had dangerous weaknesses. In 1986, Challenger broke apart shortly after launch when a seal in one of its solid boosters failed in cold weather. In 2003, Columbia was destroyed during re-entry after foam from the external tank damaged its wing during launch. Fourteen astronauts died. The Shuttle was retired in July 2011, and the lesson was clear: reusability only pays off if reusing a vehicle is cheaper than building a new one."
        ]
      },
      {
        heading: "6. The commercial era (2002–2020)",
        paragraphs: [
          "In 2002, Elon Musk founded SpaceX with the goal of drastically reducing the cost of reaching space. Its first rocket, the small Falcon 1, failed on its first three launches between 2006 and 2008, leaving the company close to bankruptcy. On 28 September 2008, the fourth Falcon 1 reached orbit, becoming the first privately developed liquid-fuelled rocket to do so.",
          "That success led to NASA contracts to deliver cargo to the International Space Station and to the much larger Falcon 9, which first flew in 2010. SpaceX then attempted something many considered impractical: landing the first stage so it could be flown again. After several failed attempts, on 21 December 2015, a Falcon 9 first stage flew back and landed upright at Cape Canaveral after launching satellites into orbit, the first time a rocket stage that helped place a payload in orbit had landed. A month earlier, Blue Origin's smaller New Shepard had landed after a suborbital flight.",
          "In March 2017, a previously flown Falcon 9 booster launched again and landed again. Within a few years, booster landings became routine, with hundreds completed, and some boosters flying more than twenty times. In 2020, a Falcon 9 launched astronauts to the International Space Station aboard a Crew Dragon capsule, the first crewed orbital flight by a private spacecraft. Smaller companies, such as Rocket Lab with its Electron rocket, opened orbit to small satellites."
        ]
      },
      {
        heading: "7. A new generation (2020s)",
        paragraphs: [
          "The 2020s brought a new generation of large rockets.",
          "SpaceX's Starship, a stainless steel rocket powered by methane engines and designed to be fully reusable, is the largest and most powerful rocket ever flown. Its test campaign has been dramatic, with several flights ending in explosions, but on 13 October 2024, its Super Heavy booster returned to the launch site and was caught in mid-air by the mechanical arms of its launch tower. In 2026, an upgraded Starship V3 flew for the first time, and on its next flight in July, it deployed satellites and splashed down intact in the ocean.",
          "NASA returned to the Moon with the Space Launch System (SLS) and the Orion capsule. Artemis I flew around the Moon without a crew in 2022, and on 1 April 2026, Artemis II launched four astronauts on a ten-day flight around the Moon, the first crewed lunar mission since 1972. On their flyby, the crew travelled farther from Earth than any humans before them.",
          "Other players have joined the race. Europe's Ariane 6 first flew on 9 July 2024. Blue Origin's New Glenn reached orbit in January 2025, landed its booster for the first time in November 2025 and reflew a landed booster in 2026. Reusable rockets are no longer an experiment but the direction the whole industry is moving in."
        ]
      },
      {
        heading: "8. Rocketry goes to university",
        paragraphs: [
          "Rocketry is no longer only for governments and large companies. Around the world, university teams design, build and launch their own rockets, often developing their own engines, electronics and recovery systems. Many of today's aerospace engineers started this way.",
          "On 21 April 2019, the University of Southern California's Rocket Propulsion Laboratory launched Traveler IV from Spaceport America in New Mexico. The solid-fuelled rocket accelerated at more than 17 g, reached about five times the speed of sound and, according to the team's analysis, crossed the 100 km Kármán line, making it the first rocket designed and built entirely by students to reach space. It was then recovered.",
          "Student competitions have grown alongside these teams. In the United States, the Spaceport America Cup brings together teams from around the world. In Europe, the European Rocketry Challenge (EuRoC) was created in 2020 by the Portuguese Space Agency. Its first edition, in Ponte de Sor, had six teams; by 2026, its seventh edition in Constância brought together around 690 students from 13 countries, with the European Space Agency as a partner. Portuguese teams, including the Porto Space Team, compete alongside some of the best student teams in Europe."
        ]
      },
      {
        heading: "What history teaches us",
        paragraphs: [
          "Looking back over eight centuries, a few patterns stand out:"
        ],
        list: [
          "Rocketry was born in war. From Chinese fire arrows to the V-2 and the first ICBMs, the same technology that opened the way to space was first built to destroy, sometimes at a terrible human cost.",
          "Failure is part of the process. Goddard was mocked, Falcon 1 failed three times, and Starship has exploded several times. Progress has come from testing, failing and learning faster.",
          "Reusability is an old dream. The Shuttle proved that partial reuse was possible; Falcon 9 proved it could make launches cheaper; Starship and New Glenn are now trying to go further.",
          "Access to space keeps widening. What started with superpowers is now open to companies, smaller countries and even university students."
        ],
        after: [
          "The next chapters, from returning to the Moon to sending people to Mars, are being written now, and some of them may be written by the students launching rockets today."
        ]
      }
    ]
  },

  fundamentals: {
    title: "Rocket Fundamentals",
    intro:
      "A rocket is a vehicle that carries everything it needs to produce thrust. " +
      "Unlike a jet engine, it does not need air from the atmosphere, " +
      "which is why rockets can work in the vacuum of space.",
    sections: [
      {
        heading: "Action and reaction",
        paragraphs: [
          "Rockets work because of Newton's third law: every action has an equal and opposite reaction. " +
          "The engine throws hot gas out of the nozzle at very high speed, and the gas pushes the rocket in the opposite direction.",
          "The rocket does not push against the ground or the air. It pushes against its own exhaust, " +
          "so it actually works slightly better in a vacuum than at sea level. " +
          "This is because the surrounding air pressure pushes back against the exhaust leaving the nozzle. " +
          "With no air outside, that loss disappears."
        ]
      },
      {
        heading: "The four forces",
        image: {
          src: "assets/guide/rocket-forces.svg",
          caption:
            "The four forces on a rocket climbing at an angle. " +
            "To lift off, its thrust has to be greater than its weight.",
          alt:
            "Diagram of a rocket climbing at an angle, with arrows for thrust, drag, lift and weight, " +
            "and the exhaust gas pushed out of the nozzle. Liftoff needs thrust greater than weight (TWR above 1)."
        },
        list: [
          { term: "Thrust", text: "the force produced by the engines, pushing the rocket forward." },
          { term: "Weight", text: "gravity pulling the rocket down. It drops during flight as propellant is burned." },
          {
            term: "Drag",
            text:
              "air resistance. It depends on both air density and speed, so it peaks at a point called Max-Q, " +
              "usually about a minute after liftoff at roughly 10–15 km altitude, " +
              "where the rocket is already fast but the air is still fairly dense."
          },
          { term: "Lift", text: "small for most rockets, which are designed to fly mostly straight through the air." }
        ],
        after: [
          "To leave the pad, a rocket's thrust must be greater than its weight. " +
          "This is called a thrust-to-weight ratio (TWR) above 1. Most launch vehicles lift off with a TWR between 1.2 and 1.5."
        ]
      },
      {
        heading: "The rocket equation",
        paragraphs: [
          "The Tsiolkovsky rocket equation explains how much a rocket can change its speed, known as delta-v (Δv):",
          "Δv = Isp × g₀ × ln(full mass / empty mass)",
          "Here Isp is the specific impulse, a measure of engine efficiency given in seconds (Isp × g₀ is the effective exhaust velocity). " +
          "Typical values are around 250–290 s for solid motors, about 300–350 s for kerosene engines and around 450 s for hydrogen engines, both in vacuum. " +
          "g₀ is standard gravity (9.81 m/s²), the full mass includes the propellant and the empty mass is what is left once it is burned.",
          "Because of the logarithm, each extra bit of speed needs much more propellant. " +
          "Reaching low Earth orbit takes about 9.4 km/s of delta-v, which is why most of a rocket's mass at liftoff is propellant. " +
          "Orbital speed itself is about 7.8 km/s; the rest is lost to gravity and drag on the way up.",
          "Example: an engine with an Isp of 300 s on a rocket that is 90% propellant (full mass 10 times the empty mass) " +
          "gives Δv = 300 × 9.81 × ln(10) ≈ 6.8 km/s. " +
          "That is still short of the 9.4 km/s needed for orbit, even though nine tenths of the rocket is fuel."
        ]
      },
      {
        heading: "Staging",
        paragraphs: [
          "Because of the rocket equation, carrying empty tanks all the way to orbit is wasteful. " +
          "Most rockets are split into stages: when a stage runs out of propellant it is dropped, " +
          "and the next stage continues with a much lighter rocket. " +
          "This resets the mass ratio and is the reason almost every orbital rocket has two or more stages."
        ]
      }
    ]
  },

  types: {
    title: "Types of Rockets",
    intro:
      "Rockets are usually grouped by the kind of propellant they burn. " +
      "Each type trades simplicity, performance and control in a different way.",
    image: {
      src: "assets/guide/rocket-types.svg",
      caption:
        "Where solid, liquid and hybrid rockets keep their fuel and oxidizer, " +
        "and how efficient and controllable each type is.",
      alt:
        "Cutaway diagrams of a solid, a liquid and a hybrid rocket. " +
        "Solid: fuel and oxidizer mixed in one grain with a burning core, about 250–290 s of specific impulse, no throttle or restart. " +
        "Liquid: separate fuel and oxidizer tanks feeding a turbopump and combustion chamber, about 300–450 s, can throttle and restart. " +
        "Hybrid: an oxidizer tank and valve above a solid fuel with a central port, about 250–300 s, can throttle and restart."
    },
    sections: [
      {
        heading: "Solid rockets",
        paragraphs: [
          "The fuel and oxidizer are mixed into a rubbery solid called the grain, cast inside the motor casing. " +
          "Once ignited, the grain burns until it is used up."
        ],
        list: [
          "Simple, reliable and can be stored for years.",
          "Produce very high thrust, which makes them ideal as boosters.",
          "Usually cannot be throttled, shut down or restarted. " +
          "Instead, the thrust profile is set before flight by the shape of the hole through the grain: " +
          "a star-shaped core, for example, burns over a larger area and gives more thrust early on.",
          "Lower efficiency, with a specific impulse of around 250–290 s.",
          "Examples: the Space Shuttle and SLS boosters, and the P120C boosters of Ariane 6."
        ]
      },
      {
        heading: "Liquid rockets",
        paragraphs: [
          "Fuel and oxidizer are stored in separate tanks and fed into a combustion chamber. " +
          "Large engines use turbopumps to push the propellants in at high pressure, while smaller ones are often pressure-fed: " +
          "the tanks are pressurized and the gas pushes the propellants into the engine. " +
          "This is the most common type for orbital launch vehicles."
        ],
        list: [
          "Higher efficiency than solid motors, from about 300 s to 450 s.",
          "Engines can be throttled, shut down and often restarted.",
          "More complex: they need pumps, valves and careful propellant handling."
        ]
      },
      {
        heading: "Common propellant combinations",
        subheading: true,
        list: [
          {
            term: "Kerosene and liquid oxygen (kerolox)",
            text: "dense and easy to handle. Used by Falcon 9."
          },
          {
            term: "Liquid hydrogen and liquid oxygen (hydrolox)",
            text:
              "the most efficient, but hydrogen is very cold and bulky. " +
              "Used by the RS-25 engines of the Space Shuttle and SLS."
          },
          {
            term: "Methane and liquid oxygen (methalox)",
            text:
              "a balance between the two, cleaner burning and well suited to reusable engines. " +
              "Used by Starship."
          },
          {
            term: "Hypergolic propellants",
            text:
              "ignite on contact, with no igniter needed, and can be stored at room temperature for long periods. " +
              "They are toxic, so today they are mostly used in spacecraft thrusters, " +
              "such as the Draco thrusters on SpaceX's Dragon."
          }
        ]
      },
      {
        heading: "Hybrid rockets",
        paragraphs: [
          "A hybrid uses a solid fuel and a liquid or gaseous oxidizer, such as nitrous oxide. " +
          "The oxidizer flows through a channel in the solid fuel, where it burns."
        ],
        list: [
          "Safer than solid motors, because fuel and oxidizer are kept apart until ignition.",
          "Can be throttled and shut down by controlling the oxidizer flow.",
          "Lower thrust for their size, because the solid fuel burns away slowly. " +
          "This is one reason they are rare on orbital rockets.",
          "Popular in student and amateur rocketry.",
          "Example: SpaceShipOne, which in 2004 became the first privately funded crewed vehicle to reach space."
        ]
      },
      {
        heading: "Beyond chemical rockets",
        paragraphs: [
          "Electric propulsion, such as ion and Hall-effect thrusters, uses electricity to accelerate a gas like xenon or krypton to very high speeds. " +
          "It is extremely efficient, with a specific impulse of 1,000 to 5,000 s, but its thrust is tiny, about the weight of a sheet of paper. " +
          "It cannot lift a rocket off the ground, but it is ideal in space for long missions and for keeping satellites in orbit, " +
          "as on NASA's Dawn probe and Starlink satellites."
        ]
      },
      {
        heading: "Comparison",
        table: {
          headers: ["Type", "Specific impulse", "Throttle / restart", "Complexity", "Typical use"],
          rows: [
            ["Solid", "~250–290 s", "No", "Low", "Boosters, missiles"],
            ["Liquid", "~300–450 s", "Yes", "High", "Main stages, upper stages"],
            ["Hybrid", "~250–300 s", "Yes", "Medium", "Student and suborbital rockets"],
            ["Electric", "~1,000–5,000 s", "Yes", "High", "In-space propulsion only"]
          ]
        }
      }
    ]
  },

  propulsion: {
    title: "Rocket Propulsion",
    intro:
      "A rocket engine turns the chemical energy in its propellants into a fast stream of exhaust gas. " +
      "The faster that gas leaves the nozzle, the more efficient the engine.",
    sections: [
      {
        heading: "Combustion chamber and nozzle",
        image: {
          src: "assets/guide/rocket-engine.svg",
          caption:
            "Inside a liquid rocket engine: the gas speeds up as the nozzle narrows, reaches the speed of sound at the throat, " +
            "then keeps accelerating to several kilometres per second as it expands in the bell.",
          alt:
            "Cross-section of a rocket engine. Fuel and oxidizer enter through the injector into the combustion chamber, " +
            "at high pressure and above 3,000 °C. The gas flows through the converging section, reaches Mach 1 at the throat " +
            "and expands in the diverging bell nozzle, leaving at about 2.5 to 4.5 km/s. Regenerative cooling runs fuel through " +
            "channels in the walls. A graph below shows velocity rising and temperature and pressure falling along the engine."
        },
        paragraphs: [
          "Fuel and oxidizer burn in the combustion chamber at high pressure and temperatures above 3,000 °C. " +
          "The hot gas then flows through a converging-diverging nozzle, also called a de Laval nozzle.",
          "The nozzle first squeezes the gas through a narrow throat, where it reaches the speed of sound. " +
          "The bell-shaped section then lets the gas expand and accelerate to several kilometres per second."
        ]
      },
      {
        heading: "Keeping the engine cool",
        paragraphs: [
          "The gas in the chamber is hotter than the melting point of most metals, so the walls must be cooled. " +
          "Most large engines use regenerative cooling: before it is burned, the fuel flows through thin channels in the chamber and nozzle walls and carries the heat away. " +
          "Other methods include film cooling, where a thin layer of fuel protects the inner wall, " +
          "and ablative materials that slowly char and erode, common in solid motors and small engines."
        ]
      },
      {
        heading: "Nozzles and altitude",
        paragraphs: [
          "A nozzle works best when the exhaust leaves at the same pressure as the surrounding air. " +
          "At sea level that means a fairly short nozzle; in vacuum, a much larger one lets the gas expand further and gives more efficiency. " +
          "Because air pressure drops during flight, first-stage nozzles are a compromise, while upper-stage engines use very large nozzles. " +
          "This is why the Merlin Vacuum engine on Falcon 9's second stage has a much bigger nozzle than the nine Merlins on the first stage. " +
          "A vacuum nozzle fired at sea level would be over-expanded, and the flow could separate from the walls and damage it."
        ]
      },
      {
        heading: "Propellants and mixture ratio",
        paragraphs: [
          "The choice of propellant sets much of an engine's performance (see Types of Rockets for a comparison). " +
          "Engines also have to mix fuel and oxidizer in the right proportion, called the mixture ratio. " +
          "Most engines run slightly fuel-rich, with a bit more fuel than the exact chemical balance, " +
          "because lighter exhaust molecules leave the nozzle faster and the hot gas is less corrosive to the engine."
        ]
      },
      {
        heading: "Thrust and specific impulse",
        paragraphs: [
          "Thrust is the force an engine produces, measured in newtons or kilonewtons. It comes from two parts:",
          "F = ṁ × vₑ + (pₑ − pₐ) × Aₑ",
          "Here ṁ is the mass of propellant leaving the nozzle per second, vₑ is the exhaust velocity, " +
          "pₑ is the gas pressure at the nozzle exit, pₐ is the outside air pressure and Aₑ is the nozzle exit area. " +
          "The first part, the momentum of the exhaust, does most of the work. " +
          "The second part explains why the same engine produces more thrust in vacuum, where pₐ is zero.",
          "Specific impulse (Isp) measures efficiency, in seconds: how long one kilogram of propellant can produce one kilogram-force of thrust.",
          "A higher Isp means more delta-v from the same amount of propellant. " +
          "Solid motors usually reach about 250 to 290 seconds, kerosene engines about 300 to 350 seconds in vacuum, " +
          "and hydrogen engines about 450 seconds in vacuum."
        ]
      },
      {
        heading: "Engine cycles",
        paragraphs: [
          "Large liquid engines need pumps to push propellant into the chamber at high pressure. " +
          "The engine cycle is the way those pumps are powered."
        ],
        list: [
          {
            term: "Pressure-fed",
            text:
              "tank pressure pushes the propellant into the chamber, with no pumps. " +
              "Simple, but limited to low chamber pressure. Used by the Draco thrusters on SpaceX's Dragon."
          },
          {
            term: "Electric pump-fed",
            text:
              "battery-powered electric motors drive the pumps. Simple to build, but the batteries are heavy, " +
              "so it suits small launchers. Used by Rocket Lab's Rutherford engine."
          },
          {
            term: "Gas generator",
            text:
              "a small part of the propellant is burned to drive the turbopumps and is then dumped overboard. " +
              "Simpler than staged combustion, but slightly less efficient. Used by the Merlin engine."
          },
          {
            term: "Staged combustion",
            text:
              "the gas that drives the turbine is sent into the main chamber, so no propellant is wasted and chamber pressure can be very high. " +
              "Used by the RD-180 and by Raptor, which uses full-flow staged combustion, where both the fuel and the oxidizer pass through turbines."
          },
          {
            term: "Expander",
            text:
              "the fuel is heated as it cools the chamber and nozzle walls, turns into gas and drives the turbine. " +
              "No extra combustion is needed, but the amount of heat available limits engine size, " +
              "so it suits upper-stage engines like the RL10."
          }
        ]
      }
    ]
  },

  anatomy: {
    title: "Rocket Anatomy",
    intro:
      "Most orbital rockets are built as a stack of stages. " +
      "Each stage has its own tanks and engines and is dropped when its propellant runs out, " +
      "so the rest of the rocket no longer has to carry its empty mass (see Rocket Fundamentals).",
    image: {
      src: "assets/guide/rocket-anatomy.svg",
      caption:
        "The main parts of a two-stage reusable rocket, from the fairing at the top to the engines, " +
        "and how little of its liftoff mass is payload.",
      alt:
        "Cutaway of a two-stage reusable rocket. From top to bottom: the payload fairing, the payload on its adapter, " +
        "avionics, the upper-stage fuel and oxidizer tanks with a common bulkhead, grid fins, the vacuum engine with its large nozzle, " +
        "the interstage, the first-stage oxygen tank with helium tanks inside, a feedline running down through the fuel tank, " +
        "folded landing legs and the engines. A bar shows the liftoff mass: about 90% propellant, 6–8% structure and 2–4% payload; " +
        "Falcon 9 weighs 549 tonnes at liftoff and carries up to 22.8 tonnes to orbit."
    },
    sections: [
      {
        heading: "Main parts, from top to bottom",
        list: [
          {
            term: "Payload fairing",
            text:
              "the nose cone that protects the payload from air pressure and heating during the climb. " +
              "It splits into two halves and is jettisoned once the rocket is above most of the atmosphere, " +
              "usually a few minutes after liftoff, to save mass. SpaceX recovers and reuses Falcon 9 fairing halves."
          },
          {
            term: "Payload",
            text:
              "the satellite, spacecraft or cargo the rocket is carrying. " +
              "It sits on a payload adapter, which holds it firmly during flight and releases it at separation."
          },
          {
            term: "Upper stage",
            text:
              "a smaller stage that completes the journey to orbit and places the payload in the right orbit. " +
              "It often has a restartable engine so it can make several burns."
          },
          {
            term: "Interstage",
            text:
              "the structure that connects two stages. It protects the upper-stage engine during the first part of the flight " +
              "and holds the separation system, which uses springs, pneumatic pushers or explosive bolts to push the stages apart."
          },
          {
            term: "First stage",
            text: "the largest stage, which lifts the whole vehicle off the pad and through the thick lower atmosphere."
          },
          {
            term: "Side boosters",
            text:
              "some rockets add strap-on boosters for extra thrust at liftoff, such as the solid boosters of Ariane 6 and SLS, " +
              "or the two extra cores of Falcon Heavy."
          },
          {
            term: "Engines",
            text:
              "mounted at the base of each stage, with nozzles sized for the air pressure where they work: " +
              "shorter on the first stage and much larger on the upper stage (see Rocket Propulsion)."
          }
        ]
      },
      {
        heading: "Propellant tanks",
        paragraphs: [
          "The tanks make up most of a rocket's volume. They are built as thin as possible to save mass, " +
          "usually from aluminium-lithium alloys, carbon composites or, in Starship's case, stainless steel.",
          "The tanks are pressurised to keep their shape, carry the loads of flight and push propellant into the engine pumps without forming bubbles. " +
          "Falcon 9 uses helium stored in small high-pressure tanks placed inside the oxygen tank. " +
          "Starship instead uses autogenous pressurisation: some of its own propellant is heated into gas and fed back into the tanks.",
          "Other design tricks save mass and length:"
        ],
        list: [
          {
            term: "Common bulkhead",
            text: "a single dome separates the fuel and oxidizer, instead of two separate tank ends."
          },
          {
            term: "Feedline through the tank",
            text: "the line from the upper tank runs straight down through the lower tank to the engines."
          },
          {
            term: "Baffles",
            text: "internal rings or plates that stop the propellant from sloshing around and upsetting the rocket's balance."
          }
        ]
      },
      {
        heading: "Where the mass goes",
        paragraphs: [
          "At liftoff, a typical orbital rocket is about 90% propellant. " +
          "The structure and engines make up around 6–8%, and the payload only 2–4%. " +
          "Falcon 9, for example, weighs about 549 tonnes at liftoff but can carry at most 22.8 tonnes to low Earth orbit, " +
          "and only when the booster is not recovered. This small fraction is a direct result of the rocket equation."
        ]
      },
      {
        heading: "Avionics and control",
        list: [
          {
            term: "Flight computer",
            text:
              "runs the guidance, navigation and control software and sends commands to the engines and valves. " +
              "It is usually duplicated or tripled, so a single failure does not end the mission."
          },
          {
            term: "Inertial measurement unit (IMU)",
            text:
              "measures acceleration and rotation. The flight computer uses these readings, corrected with GPS, " +
              "to work out the rocket's position, speed and attitude."
          },
          {
            term: "Thrust vector control",
            text:
              "actuators gimbal the engine nozzles to steer the rocket. A single gimballed engine cannot control roll, " +
              "so stages with one engine add small thrusters for it. Solid motors steer with flexible nozzles."
          },
          {
            term: "Reaction control system (RCS)",
            text: "small thrusters that control the rocket's attitude in space, when the main engines are off."
          },
          {
            term: "Telemetry",
            text: "radio links that send live data about the rocket's systems to the ground."
          },
          {
            term: "Flight termination system",
            text:
              "if the rocket flies off course, it shuts down the engines and breaks up the vehicle before it can reach populated areas. " +
              "Many rockets now use an autonomous system that makes this decision on board, without waiting for a command from the ground."
          }
        ]
      },
      {
        heading: "Recovery hardware",
        paragraphs: [
          "Reusable boosters carry extra hardware:"
        ],
        list: [
          { term: "Grid fins", text: "steer the booster through the atmosphere on the way back." },
          { term: "Cold-gas thrusters", text: "flip and orient the booster after separation." },
          { term: "Landing legs", text: "fold out just before touchdown." },
          {
            term: "Reserve propellant",
            text: "kept for the boostback, entry and landing burns. This reduces the payload the rocket can carry."
          }
        ],
        after: [
          "Starship's Super Heavy booster has no legs at all: it is caught by mechanical arms on the launch tower. " +
          "Smaller rockets, including most student rockets, use parachutes instead: " +
          "a small drogue chute opens near the highest point of the flight and a larger main chute opens closer to the ground."
        ]
      }
    ]
  },

  stages: {
    title: "Flight Stages",
    intro:
      "A launch to low Earth orbit takes around eight to ten minutes. " +
      "Missions to higher orbits add long coast phases and can take hours before the payload is released. " +
      "These are the main events, in the order they usually happen; " +
      "the times are from a typical Falcon 9 launch of Starlink satellites.",
    image: {
      src: "assets/guide/rocket-flight.svg",
      caption:
        "A typical launch to low Earth orbit, with the main events along the way, the first stage returning to a drone ship, " +
        "and approximate times from a Falcon 9 Starlink launch.",
      alt:
        "Trajectory of a two-stage rocket, not to scale. From the launch pad: liftoff, pitch-over at the start of the gravity turn, " +
        "Max-Q, stage separation with MECO and second-stage ignition, fairing separation above the thick air and about 100 km up, " +
        "SECO and payload deployment in orbit. The first stage returns with an entry burn and a landing burn on a drone ship. " +
        "Falcon 9 timeline: engine ignition T−0:03, liftoff T+0:00, Max-Q T+1:12, MECO T+2:27, stage separation T+2:31, " +
        "second-stage ignition T+2:37, fairing separation T+2:42, entry burn T+6:46, landing burn T+8:23, SECO T+8:42, " +
        "booster lands T+8:45, payload deployed T+29:03. A booster landing back on land first flips and fires a boostback burn."
    },
    sections: [
      {
        heading: "From the pad to space",
        list: [
          {
            term: "Ignition and liftoff",
            text:
              "liquid engines start a few seconds before liftoff, about 3 seconds on Falcon 9. " +
              "The flight computer checks that they are healthy and at full thrust, and only then do the hold-down clamps release the rocket. " +
              "If something is wrong, the engines can still be shut down on the pad. " +
              "Solid boosters are different: once lit, they cannot be stopped, so their ignition is the point of no return."
          },
          {
            term: "Roll and pitch-over",
            text:
              "after clearing the tower, the rocket rolls to face its launch direction and starts to tilt. " +
              "From then on it follows a gravity turn: gravity gradually bends its path from vertical to horizontal, " +
              "while the rocket keeps its nose pointed into the airflow to avoid strong sideways loads."
          },
          {
            term: "Max-Q",
            text:
              "the moment of maximum aerodynamic pressure, which depends on both speed and air density. " +
              "It happens around 1 minute 10 seconds into flight, just after the rocket goes supersonic. " +
              "Some rockets throttle down beforehand to reduce stress."
          },
          {
            term: "Booster separation",
            text: "on rockets with side boosters, they burn out and are released, usually about two minutes into flight."
          },
          {
            term: "MECO (main engine cut-off)",
            text:
              "the first stage shuts down, about two and a half minutes into flight on Falcon 9. " +
              "On reusable rockets it does not burn all of its propellant, because it keeps some for landing."
          },
          {
            term: "Stage separation",
            text: "a few seconds later, the separation system pushes the two stages apart."
          },
          {
            term: "Second-stage ignition",
            text:
              "in free fall, the propellant floats inside the tanks, so it must first be settled at the bottom. " +
              "Small thrusters or the push from separation give a brief acceleration before the upper-stage engine starts."
          },
          {
            term: "Fairing separation",
            text:
              "about three minutes into flight, once the rocket is above most of the atmosphere, the fairing halves are jettisoned."
          }
        ]
      },
      {
        heading: "Reaching orbit",
        list: [
          {
            term: "SECO (second-stage engine cut-off)",
            text:
              "the upper stage shuts down once it reaches the planned orbit, " +
              "around 8 to 9 minutes after liftoff for low Earth orbit."
          },
          {
            term: "Coast and restart",
            text:
              "for higher orbits, the upper stage coasts, sometimes for half an orbit, and restarts its engine at the right point. " +
              "For geostationary missions, this burn raises the high point of the orbit to about 36,000 km."
          },
          {
            term: "Payload deployment",
            text:
              "the satellite or spacecraft separates and begins its own mission, " +
              "anywhere from a few minutes to several hours after liftoff."
          },
          {
            term: "Upper-stage disposal",
            text:
              "after deployment, the upper stage either fires a deorbit burn so that it burns up in the atmosphere, " +
              "or moves to a disposal orbit. It also vents any leftover propellant, " +
              "so it cannot later explode and create space debris."
          }
        ]
      },
      {
        heading: "Booster recovery",
        paragraphs: [
          "On reusable rockets, the first stage turns around after separation and makes up to three burns:"
        ],
        list: [
          {
            term: "Boostback burn",
            text:
              "only needed when landing back near the launch site. The booster flips and fires its engines to reverse direction. " +
              "For drone ship landings it is usually skipped, because the ship is already waiting downrange."
          },
          {
            term: "Entry burn",
            text:
              "a short burn, around six to seven minutes after liftoff, that slows the booster before it enters the denser atmosphere " +
              "and reduces heating and stress. Grid fins then steer it towards the landing site."
          },
          {
            term: "Landing burn",
            text:
              "the final burn before touchdown. Even with one engine at its lowest setting, " +
              "Falcon 9's booster produces more thrust than its empty weight, so it cannot hover. " +
              "The burn is timed so that the speed reaches zero exactly as the legs touch the landing pad or drone ship."
          }
        ],
        after: [
          "The fairing halves are also recovered: they glide down under parachutes and are picked up from the sea."
        ]
      },
      {
        heading: "If something goes wrong",
        paragraphs: [
          "Crewed spacecraft carry a launch escape system: powerful thrusters that can pull the capsule away from a failing rocket " +
          "at any point from the pad to orbit, before it returns to Earth under parachutes. " +
          "Crew Dragon, for example, uses its SuperDraco thrusters for this."
        ]
      }
    ]
  },

  "filling-station": {
    title: "Filling Station",
    intro: [
      "A filling station is the ground support equipment (GSE) that loads propellant into a rocket before launch. " +
      "It lets the team fill, monitor and, if needed, empty the tanks safely from a distance.",
      "On large launch vehicles, this is a complex, automated system that loads tonnes of cryogenic propellant " +
      "in the final half hour or so before liftoff. In student rocketry, it is usually a smaller setup that fills " +
      "the oxidizer tank of a hybrid rocket with nitrous oxide, and it is often designed and built by the team itself."
    ],
    image: {
      src: "assets/guide/filling-station.svg",
      caption:
        "A simplified nitrous oxide filling station for a student hybrid rocket: the lines, valves and sensors on the pad, " +
        "and the control station at a safe distance.",
      alt:
        "Schematic of a nitrous oxide filling station. In the pad area, a nitrous oxide bottle on a load cell feeds a line through " +
        "a manual valve, a check valve, a relief valve and a solenoid fill valve that is closed when unpowered, then through a quick " +
        "disconnect into the rocket's oxidizer tank, which holds liquid with vapour above it and sits above the motor. A nitrogen bottle " +
        "with a regulator and a check valve joins the line for purging and leak tests. A dump valve, open when unpowered, can empty the line, " +
        "and a solenoid vent valve releases gas from the top of the tank. Pressure and temperature sensors on the tank and the valves are " +
        "wired to a pad box with relays and a battery, which is linked by a long cable or radio to a control station at a safe distance, " +
        "with live data, an arming key and an emergency stop. If the link or power is lost, the fill valve closes and the dump valve opens."
    },
    sections: [
      {
        heading: "Why nitrous oxide needs care",
        paragraphs: [
          "Nitrous oxide (N₂O) is popular because it is self-pressurising: at room temperature it is stored as a liquid with gas above it, " +
          "at around 50 bar at 20 °C. This means it can push itself into the engine without pumps, " +
          "but it also has some important consequences:"
        ],
        list: [
          "Its pressure depends almost only on temperature, not on how much is in the tank. A bottle left in the sun can reach dangerous pressures.",
          "Because of this, pressure alone cannot tell you how full the tank is.",
          "If it is contaminated or overheated, nitrous oxide can decompose violently, releasing heat. " +
          "Cleanliness and compatible materials are essential."
        ]
      },
      {
        heading: "Propellant system",
        list: [
          {
            term: "Storage tanks or bottles",
            text: "hold the propellant or oxidizer, such as liquid oxygen or nitrous oxide."
          },
          {
            term: "Fill lines",
            text: "pipes and hoses rated for the pressure and temperature of the propellant."
          },
          {
            term: "Quick disconnect",
            text:
              "a coupling that separates cleanly from the rocket at liftoff or just before it, " +
              "often pulled by a cable or an actuator."
          },
          {
            term: "Vent line",
            text: "releases gas from the rocket's tank so that liquid can flow in, and prevents over-pressure."
          },
          {
            term: "Dump line",
            text: "lets the team empty the tank remotely if the launch is cancelled or something goes wrong."
          },
          {
            term: "Purge system",
            text:
              "usually nitrogen, used to clear the lines of propellant, air and moisture, " +
              "and to leak-test the system before any propellant is loaded."
          }
        ]
      },
      {
        heading: "Valves",
        list: [
          {
            term: "Ball valves",
            text:
              "open or close the main flow with very little restriction, " +
              "often moved by a motor or pneumatic actuator for remote control."
          },
          {
            term: "Solenoid valves",
            text:
              "electrically controlled valves for fast, remote switching. " +
              "They are simple to drive, but many only allow a small flow."
          },
          {
            term: "Check valves",
            text:
              "only allow flow in one direction, " +
              "for example to stop propellant flowing back into the nitrogen line."
          },
          {
            term: "Relief valves and burst discs",
            text:
              "a relief valve opens automatically above a set pressure; " +
              "a burst disc is a thin membrane that ruptures as a last line of defence."
          },
          {
            term: "Pressure regulators",
            text: "keep a constant pressure downstream, for example on the nitrogen line."
          }
        ],
        after: [
          "Remotely operated valves are chosen to be fail-safe. A normally closed (NC) valve shuts when it loses power, " +
          "and a normally open (NO) valve opens. A common choice is an NC fill valve and an NO dump valve: " +
          "if power or communication is lost, filling stops and the tank empties itself."
        ]
      },
      {
        heading: "Sensors and control electronics",
        paragraphs: [
          "Pressure transducers, thermocouples and load cells tell the team how much propellant is in the tank and whether conditions are safe. " +
          "With nitrous oxide, a load cell under the rocket or the supply bottle is the most reliable way to measure the mass transferred, " +
          "since the pressure does not change as the tank fills. " +
          "Many teams also watch the vent: when liquid instead of gas starts to come out, the tank is full.",
          "The electronics are usually split in two:"
        ],
        list: [
          {
            term: "Pad box",
            text:
              "sits near the rocket and switches the valves through relays or transistor drivers, " +
              "reads the sensors and has its own battery."
          },
          {
            term: "Control station",
            text:
              "sits at a safe distance, shows live data, logs everything and sends commands. " +
              "It usually includes an arming key and an emergency stop button."
          }
        ],
        after: [
          "The two are connected by a long cable or a radio link and send each other a regular heartbeat signal. " +
          "The system must fail safe: if the heartbeat is lost, the pad box moves the valves to a safe position on its own."
        ]
      },
      {
        heading: "A typical filling sequence",
        ordered: true,
        list: [
          "Check the system with nitrogen: pressurise it, look for leaks and confirm that every valve and sensor responds.",
          "Purge the lines with nitrogen to remove air and moisture.",
          "Clear the pad area and arm the system from the control station.",
          "Open the fill valve and the vent, and watch the mass, pressure and temperature as the tank fills.",
          "Close the fill valve once the target mass is reached or liquid appears at the vent.",
          "Close the vent, disconnect the fill line and prepare for launch, or dump the tank if the launch is cancelled."
        ]
      },
      {
        heading: "Safety",
        list: [
          "Keep people away from the pad while the rocket is pressurised, and only approach after the system has been made safe.",
          "Always have a way to vent and empty the tank remotely.",
          "Use a checklist for every fill, with one person in charge of safety, and test the system with an inert gas first.",
          "Pressure-test the rocket's tank and lines above their working pressure before using real propellant.",
          "Only use materials that are compatible with the propellant. With oxygen and nitrous oxide, parts must be cleaned of oil and grease, " +
          "and only oxygen-compatible lubricants and seals may be used.",
          "Ground all metal parts to prevent static sparks.",
          "Wear protective equipment, such as a face shield and gloves, when handling the system."
        ]
      }
    ]
  },

  glossary: {
    title: "Space Glossary",
    intro: "Common terms you will see in launch coverage, mission details and across the Rocket Guide.",
    // A long list: show an "On this page" index with a link to each section
    toc: true,
    sections: [
      {
        heading: "Orbits and trajectories",
        list: [
          { term: "Orbit", text: "the curved path of an object moving around a planet or star, falling towards it but moving sideways fast enough to keep missing it." },
          { term: "Apogee", text: "the highest point of an orbit around Earth. The general term for any body is apoapsis." },
          { term: "Perigee", text: "the lowest point of an orbit around Earth. The general term for any body is periapsis." },
          { term: "Inclination", text: "the angle between an orbit and the equator. 0° is an equatorial orbit and 90° is a polar orbit. A rocket launched straight east reaches an inclination roughly equal to the latitude of its launch site." },
          { term: "Orbital period", text: "the time it takes to complete one orbit. In low Earth orbit it is about 90 minutes." },
          { term: "Orbital velocity", text: "the speed needed to stay in orbit, about 7.8 km/s in low Earth orbit." },
          { term: "Escape velocity", text: "the speed needed to leave Earth's gravity completely, about 11.2 km/s from the surface." },
          { term: "Kármán line", text: "the boundary commonly used as the edge of space, at 100 km altitude. The United States uses 80 km for some purposes." },
          { term: "LEO", text: "low Earth orbit, roughly 160 to 2,000 km above the surface. The ISS orbits at around 400 to 420 km." },
          { term: "MEO", text: "medium Earth orbit, between LEO and GEO. GPS satellites orbit at about 20,200 km." },
          { term: "GEO", text: "geostationary orbit, about 35,786 km above the equator, where a satellite matches Earth's rotation and appears fixed in the sky." },
          { term: "Geosynchronous orbit", text: "any orbit with a period of one day. A geostationary orbit is the special case that is circular and directly above the equator." },
          { term: "GTO", text: "geostationary transfer orbit, an elliptical orbit with a low perigee and an apogee near GEO altitude, used to reach geostationary orbit." },
          { term: "SSO", text: "Sun-synchronous orbit, a near-polar orbit that slowly rotates with Earth's path around the Sun, so the satellite passes over each place at the same local time. Popular for Earth observation." },
          { term: "Molniya orbit", text: "a highly elliptical orbit with a 12-hour period, used to cover high-latitude regions for long periods." },
          { term: "Parking orbit", text: "a temporary low orbit where the upper stage coasts before a later burn to its final orbit." },
          { term: "Lagrange points", text: "five points where the gravity of two large bodies balances the motion of a small one. The James Webb Space Telescope operates near the Sun-Earth L2 point, about 1.5 million km from Earth." },
          { term: "TLI", text: "trans-lunar injection, the burn that sends a spacecraft from Earth orbit towards the Moon." },
          { term: "Deorbit burn", text: "a burn that lowers an orbit so that the object re-enters the atmosphere." }
        ]
      },
      {
        heading: "Rockets and engines",
        list: [
          { term: "Stage", text: "a section of a rocket with its own tanks and engines, dropped when its propellant runs out." },
          { term: "Booster", text: "the first stage, or an extra side rocket attached to help at liftoff." },
          { term: "Upper stage", text: "the stage that completes the climb to orbit and places the payload." },
          { term: "Delta-v (Δv)", text: "the total change in velocity a rocket or spacecraft can achieve with its propellant." },
          { term: "Specific impulse (Isp)", text: "a measure of engine efficiency, in seconds." },
          { term: "Mass ratio", text: "the rocket's full mass divided by its empty mass. A higher ratio gives more delta-v." },
          { term: "Thrust", text: "the force produced by an engine, measured in newtons or kilonewtons." },
          { term: "TWR", text: "thrust-to-weight ratio. It must be above 1 for a rocket to lift off." },
          { term: "Throttle", text: "changing an engine's thrust during flight." },
          { term: "Chamber pressure", text: "the pressure inside the combustion chamber. Higher pressure generally means a smaller, more efficient engine." },
          { term: "De Laval nozzle", text: "the converging-diverging nozzle that accelerates the exhaust to supersonic speed." },
          { term: "Expansion ratio", text: "the nozzle exit area divided by the throat area. Vacuum engines use much larger ratios." },
          { term: "Turbopump", text: "a pump driven by a turbine that feeds propellant into the engine at high pressure." },
          { term: "Engine cycle", text: "the way an engine powers its pumps, such as gas generator, staged combustion or expander." },
          { term: "Regenerative cooling", text: "cooling the engine walls by passing propellant through channels in them before it is burned." },
          { term: "Gimbal", text: "a pivot that lets an engine tilt to steer the rocket." },
          { term: "TVC", text: "thrust vector control, steering a rocket by changing the direction of its thrust." },
          { term: "RCS", text: "reaction control system, small thrusters used to control attitude, mainly in space." },
          { term: "Fairing", text: "the protective nose cone around the payload, jettisoned once the rocket is above most of the atmosphere." },
          { term: "Interstage", text: "the structure that connects two stages and holds the separation system." },
          { term: "Avionics", text: "the rocket's electronics, including the flight computer, sensors and radios." },
          { term: "IMU", text: "inertial measurement unit, a sensor that measures acceleration and rotation." },
          { term: "FTS", text: "flight termination system, which ends the flight safely if the rocket goes off course." }
        ]
      },
      {
        heading: "Propellants",
        list: [
          { term: "Propellant", text: "the fuel and oxidizer a rocket burns." },
          { term: "Oxidizer", text: "the substance that provides oxygen for combustion, since there is no air in space." },
          { term: "LOX", text: "liquid oxygen, the most common oxidizer, stored at about −183 °C." },
          { term: "RP-1", text: "a highly refined kerosene used as rocket fuel." },
          { term: "LH2", text: "liquid hydrogen, the most efficient chemical fuel, stored at about −253 °C." },
          { term: "Kerolox, hydrolox, methalox", text: "short names for kerosene, hydrogen and methane burned with liquid oxygen." },
          { term: "Cryogenic", text: "stored at very low temperatures, such as liquid oxygen and hydrogen." },
          { term: "Boil-off", text: "cryogenic propellant slowly evaporating because of heat leaking into the tank." },
          { term: "Hypergolic", text: "propellants that ignite on contact with each other." },
          { term: "Nitrous oxide (N₂O)", text: "a self-pressurising oxidizer common in hybrid and student rockets." },
          { term: "Ullage", text: "the gas-filled space above the liquid in a tank. Ullage thrusters settle the propellant at the bottom of the tank before an engine restarts." }
        ]
      },
      {
        heading: "Launch day",
        list: [
          { term: "NET", text: "no earlier than: the earliest possible launch date or time." },
          { term: "T-0", text: "the planned moment of liftoff. Times before it are written as T-minus and times after it as T-plus." },
          { term: "Launch window", text: "the period during which the launch can take place. An instantaneous window allows only one exact moment." },
          { term: "Hold", text: "a planned or unplanned pause in the countdown." },
          { term: "Go/No-Go poll", text: "the final check where each team confirms it is ready to launch." },
          { term: "Recycle", text: "resetting the countdown to an earlier point to try again on the same day." },
          { term: "Scrub", text: "a cancelled launch attempt, usually moved to a later date." },
          { term: "Abort", text: "stopping a launch or a flight because of a problem, from the pad or during the climb." },
          { term: "Static fire", text: "a test where the engines are fired while the rocket is held on the pad." },
          { term: "Wet dress rehearsal", text: "a full countdown practice with propellant loaded, stopping just before engine ignition." },
          { term: "Hold-down clamps", text: "clamps that keep the rocket on the pad until the engines reach full thrust." },
          { term: "Upper-level winds", text: "strong winds high in the atmosphere that can delay a launch even when the weather on the ground is good." },
          { term: "Range", text: "the area and tracking systems that monitor a launch and keep the public safe." }
        ]
      },
      {
        heading: "Flight events",
        list: [
          { term: "Liftoff", text: "the moment the rocket leaves the pad." },
          { term: "Gravity turn", text: "the gradual tilt of the rocket's path from vertical to horizontal, guided by gravity." },
          { term: "Max-Q", text: "the point of maximum aerodynamic pressure during the climb." },
          { term: "MECO / SECO", text: "main engine cut-off and second-stage engine cut-off." },
          { term: "Stage separation", text: "the moment the stages are pushed apart." },
          { term: "Fairing separation", text: "the moment the fairing halves are jettisoned." },
          { term: "Coast", text: "a phase where the engines are off and the rocket moves on momentum." },
          { term: "Payload deployment", text: "the moment the satellite or spacecraft separates from the rocket." },
          { term: "Nominal", text: "everything is going according to plan." },
          { term: "Anomaly", text: "an unexpected problem or result." },
          { term: "LOS / AOS", text: "loss of signal and acquisition of signal, when radio contact with a vehicle is lost or regained." }
        ]
      },
      {
        heading: "Recovery and reuse",
        list: [
          { term: "Boostback burn", text: "a burn that reverses the booster's direction so it can land near the launch site." },
          { term: "Entry burn", text: "a burn that slows the booster before it enters the denser atmosphere." },
          { term: "Landing burn", text: "the final burn that brings the booster to zero speed at touchdown." },
          { term: "Grid fins", text: "lattice-shaped fins that steer a returning booster through the atmosphere." },
          { term: "RTLS", text: "return to launch site, a booster landing on land near the pad." },
          { term: "ASDS", text: "autonomous spaceport drone ship, the floating platform SpaceX boosters land on at sea." },
          { term: "Re-entry", text: "returning from space into the atmosphere, which produces intense heating." },
          { term: "Heat shield", text: "the layer that protects a vehicle from the heat of re-entry." },
          { term: "Splashdown", text: "a spacecraft landing in the sea under parachutes." },
          { term: "Refurbishment", text: "the inspection and repair work done before a vehicle flies again." },
          { term: "RUD", text: "rapid unscheduled disassembly, an informal and humorous term for a vehicle breaking up or exploding." }
        ]
      },
      {
        heading: "Spacecraft and missions",
        list: [
          { term: "Payload", text: "whatever the rocket carries to space, such as a satellite, spacecraft or cargo." },
          { term: "Rideshare", text: "a launch carrying payloads from many different customers." },
          { term: "Constellation", text: "a large group of satellites working together, such as Starlink or GPS." },
          { term: "CubeSat", text: "a small standardised satellite built from 10 cm cubes, each weighing about 1 to 2 kg." },
          { term: "Rendezvous", text: "two spacecraft meeting in orbit." },
          { term: "Docking", text: "a spacecraft connecting to another under its own control." },
          { term: "Berthing", text: "a spacecraft being captured by a robotic arm and attached to a station." },
          { term: "Space debris", text: "old satellites, rocket stages and fragments that remain in orbit." }
        ]
      }
    ]
  }
};

// GLOSSARY TERMS IN THE ARTICLES
// The first time one of these phrases appears in an article (not in the
// glossary itself), it is underlined and tapping it shows the definition
// from the Space Glossary above. Key: the glossary term, exactly as written
// there. Value: the phrases to look for in the text (a plural "s" also
// matches). Leave out everyday words such as "rocket" or "stage".
const GLOSSARY_LINKS = {
  "Max-Q": ["Max-Q", "Max Q"],
  "Delta-v (Δv)": ["delta-v"],
  "Specific impulse (Isp)": ["specific impulse"],
  "Mass ratio": ["mass ratio"],
  "TWR": ["thrust-to-weight ratio"],
  "Apogee": ["apogee"],
  "Perigee": ["perigee"],
  "Inclination": ["inclination"],
  "Orbital velocity": ["orbital velocity", "orbital speed"],
  "Escape velocity": ["escape velocity"],
  "Kármán line": ["Kármán line", "Karman line"],
  "LEO": ["low Earth orbit"],
  "GEO": ["geostationary orbit"],
  "GTO": ["geostationary transfer orbit"],
  "SSO": ["Sun-synchronous orbit"],
  "Parking orbit": ["parking orbit"],
  "Lagrange points": ["Lagrange point"],
  "TLI": ["trans-lunar injection"],
  "Gravity turn": ["gravity turn"],
  "Turbopump": ["turbopump"],
  "Engine cycle": ["engine cycle"],
  "Chamber pressure": ["chamber pressure"],
  "De Laval nozzle": ["de Laval nozzle"],
  "Expansion ratio": ["expansion ratio"],
  "Regenerative cooling": ["regenerative cooling"],
  "Gimbal": ["gimbal"],
  "Throttle": ["throttle"],
  "TVC": ["thrust vector control"],
  "RCS": ["reaction control system"],
  "IMU": ["inertial measurement unit"],
  "FTS": ["flight termination system"],
  "Avionics": ["avionics"],
  "Fairing": ["fairing"],
  "Interstage": ["interstage"],
  "Oxidizer": ["oxidizer"],
  "LOX": ["liquid oxygen"],
  "LH2": ["liquid hydrogen"],
  "RP-1": ["RP-1"],
  "Cryogenic": ["cryogenic"],
  "Boil-off": ["boil-off"],
  "Hypergolic": ["hypergolic"],
  "Ullage": ["ullage"],
  "Launch window": ["launch window"],
  "Static fire": ["static fire"],
  "Wet dress rehearsal": ["wet dress rehearsal"],
  "Hold-down clamps": ["hold-down clamp"],
  "Scrub": ["scrub"],
  "Boostback burn": ["boostback burn"],
  "Entry burn": ["entry burn"],
  "Landing burn": ["landing burn"],
  "Grid fins": ["grid fin"],
  "RTLS": ["return to launch site"],
  "ASDS": ["drone ship"],
  "Re-entry": ["re-entry"],
  "Heat shield": ["heat shield"],
  "Splashdown": ["splashdown"],
  "Rideshare": ["rideshare"],
  "Constellation": ["constellation"],
  "CubeSat": ["CubeSat"],
  "Rendezvous": ["rendezvous"],
  "Space debris": ["space debris"]
};
