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
      "Each stage has its own tanks and engines and is dropped when its propellant runs out.",
    sections: [
      {
        heading: "Main parts, from top to bottom",
        list: [
          { term: "Payload fairing", text: "the nose cone that protects the payload from air and heat during the climb." },
          { term: "Payload", text: "the satellite, spacecraft or cargo the rocket is carrying." },
          { term: "Upper stage", text: "a smaller stage that completes the journey to orbit, often with a restartable engine." },
          { term: "Interstage", text: "the structure that connects two stages and holds the separation system." },
          { term: "First stage", text: "the largest stage, which lifts the whole vehicle off the pad." },
          { term: "Engines", text: "mounted at the base of each stage, usually with a nozzle optimised for the air pressure where they work." }
        ]
      },
      {
        heading: "Propellant tanks",
        paragraphs: [
          "The tanks make up most of a rocket's volume. They are built as thin as possible to save mass, " +
          "and they are pressurised, often with helium, to keep their shape and feed the engines."
        ]
      },
      {
        heading: "Avionics and control",
        list: [
          { term: "Flight computer", text: "runs the guidance software and sends commands to the engines and valves." },
          { term: "Inertial measurement unit (IMU)", text: "measures acceleration and rotation to work out the rocket's position and attitude." },
          { term: "Thrust vector control", text: "gimbals the engine nozzles to steer the rocket." },
          { term: "Flight termination system", text: "destroys the vehicle safely if it flies off course." }
        ]
      },
      {
        heading: "Recovery hardware",
        paragraphs: [
          "Reusable boosters carry extra hardware: grid fins to steer through the atmosphere, " +
          "landing legs, and spare propellant for the landing burns."
        ]
      }
    ]
  },

  stages: {
    title: "Flight Stages",
    intro:
      "A launch to orbit takes around ten minutes. " +
      "These are the main events, in the order they usually happen.",
    sections: [
      {
        heading: "From the pad to space",
        list: [
          { term: "Ignition and liftoff", text: "the engines start and, once they reach full thrust, the hold-down clamps release the rocket." },
          { term: "Pitch-over", text: "shortly after clearing the tower, the rocket starts to tilt and follows a curved gravity turn." },
          { term: "Max-Q", text: "the moment of maximum aerodynamic pressure, about one minute into flight. Some rockets throttle down to reduce stress." },
          { term: "MECO", text: "main engine cut-off: the first stage shuts down." },
          { term: "Stage separation", text: "the first stage is released and the upper stage moves away." },
          { term: "Second-stage ignition", text: "the upper-stage engine starts and continues the climb." },
          { term: "Fairing separation", text: "once the rocket is above most of the atmosphere, the fairing halves are jettisoned." }
        ]
      },
      {
        heading: "Reaching orbit",
        list: [
          { term: "SECO", text: "second-stage engine cut-off, once the target orbit is reached." },
          { term: "Coast and restart", text: "for higher orbits, the upper stage may coast and then restart its engine." },
          { term: "Payload deployment", text: "the satellite or spacecraft separates and begins its own mission." }
        ]
      },
      {
        heading: "Booster recovery",
        paragraphs: [
          "On reusable rockets, the first stage turns around after separation. " +
          "It may perform a boostback burn to head back to land, an entry burn to slow down before re-entering the denser atmosphere, " +
          "and a final landing burn to touch down on a landing pad or a drone ship."
        ]
      }
    ]
  },

  "filling-station": {
    title: "Filling Station",
    intro:
      "A filling station is the ground support equipment (GSE) that loads propellant into a rocket before launch. " +
      "It lets the team fill, monitor and, if needed, empty the tanks safely from a distance.",
    sections: [
      {
        heading: "Propellant system",
        list: [
          { term: "Storage tanks or bottles", text: "hold the propellant or oxidizer, such as liquid oxygen or nitrous oxide." },
          { term: "Fill lines", text: "pipes and hoses rated for the pressure and temperature of the propellant." },
          { term: "Quick disconnect", text: "a coupling that separates cleanly from the rocket at liftoff or before it." },
          { term: "Vent line", text: "releases gas from the rocket's tank so it can be filled and to avoid over-pressure." },
          { term: "Purge system", text: "usually nitrogen, used to clear lines of propellant, air and moisture." }
        ]
      },
      {
        heading: "Valves",
        list: [
          { term: "Ball valves", text: "open or close the main flow, often with a motor or pneumatic actuator for remote control." },
          { term: "Solenoid valves", text: "electrically controlled valves for fast, remote switching." },
          { term: "Check valves", text: "only allow flow in one direction." },
          { term: "Relief valves", text: "open automatically if the pressure goes above a safe limit." },
          { term: "Pressure regulators", text: "keep a constant pressure downstream." }
        ]
      },
      {
        heading: "Sensors and control electronics",
        paragraphs: [
          "Pressure transducers, thermocouples and load cells tell the team how much propellant is in the tank and whether conditions are safe. " +
          "A load cell under the rocket or the supply bottle is a simple way to measure the mass transferred.",
          "A control box, often based on a microcontroller, drives the valves and reads the sensors. " +
          "It is operated from a safe distance, through a long cable or a radio link, and must fail safe: " +
          "if the connection is lost, the valves should move to a safe position."
        ]
      },
      {
        heading: "Safety",
        list: [
          "Keep people away from the pad while the rocket is pressurised.",
          "Always have a way to vent and empty the tank remotely.",
          "Use a checklist for every fill, and test the system with an inert gas first.",
          "Only use materials that are compatible with the propellant, especially with oxygen and nitrous oxide."
        ]
      }
    ]
  },

  glossary: {
    title: "Space Glossary",
    intro: "Common terms you will see in launch coverage and in mission details.",
    sections: [
      {
        heading: "Orbits",
        list: [
          { term: "Apogee", text: "the highest point of an orbit around Earth." },
          { term: "Perigee", text: "the lowest point of an orbit around Earth." },
          { term: "LEO", text: "low Earth orbit, roughly 160 to 2,000 km above the surface. The ISS orbits at about 420 km." },
          { term: "GTO", text: "geostationary transfer orbit, an elliptical orbit used to reach geostationary orbit." },
          { term: "GEO", text: "geostationary orbit, about 35,786 km above the equator, where a satellite matches Earth's rotation." },
          { term: "SSO", text: "Sun-synchronous orbit, a polar orbit that passes over each place at the same local time." }
        ]
      },
      {
        heading: "Vehicles and engines",
        list: [
          { term: "Delta-v (Δv)", text: "the total change in speed a rocket or spacecraft can achieve." },
          { term: "Specific impulse (Isp)", text: "a measure of engine efficiency, in seconds." },
          { term: "TWR", text: "thrust-to-weight ratio. It must be above 1 for a rocket to lift off." },
          { term: "Gimbal", text: "a pivot that lets an engine tilt to steer the rocket." },
          { term: "Fairing", text: "the protective nose cone around the payload." },
          { term: "LOX", text: "liquid oxygen, the most common oxidizer." },
          { term: "Hypergolic", text: "propellants that ignite on contact with each other." }
        ]
      },
      {
        heading: "Launch day",
        list: [
          { term: "NET", text: "no earlier than: the earliest possible launch date or time." },
          { term: "T-0", text: "the planned moment of liftoff. Times before it are written as T-minus." },
          { term: "Launch window", text: "the period during which the launch can take place." },
          { term: "Scrub", text: "a cancelled launch attempt, usually moved to a later date." },
          { term: "Static fire", text: "a test where the engines are fired while the rocket is held on the pad." },
          { term: "Max-Q", text: "the point of maximum aerodynamic pressure during the climb." },
          { term: "MECO / SECO", text: "main engine cut-off and second-stage engine cut-off." }
        ]
      }
    ]
  }
};
