// ROCKET GUIDE CONTENT
// One entry per data-topic value used by the guide cards in index.html.
// Each section can have "paragraphs" (shown first), a "list" and
// "after" (paragraphs shown after the list).
// List items are plain strings, or { term, text } for definition-style items.
// A section can also have an "image" ({ src, alt }), shown under its heading.

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
          "Typical values are around 250–270 s for solid motors, about 300 s for kerosene engines and around 450 s for hydrogen engines in vacuum. " +
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
          "Usually cannot be throttled, shut down or restarted.",
          "Examples: the Space Shuttle boosters and the side boosters of Ariane 5."
        ]
      },
      {
        heading: "Liquid rockets",
        paragraphs: [
          "Fuel and oxidizer are stored in separate tanks and pumped into a combustion chamber. " +
          "This is the most common type for orbital launch vehicles."
        ],
        list: [
          "Higher efficiency than solid motors.",
          "Engines can be throttled, shut down and often restarted.",
          "More complex: they need pumps, valves and careful propellant handling.",
          "Examples: Falcon 9 (kerosene and liquid oxygen) and Starship (methane and liquid oxygen)."
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
          "Popular in student and amateur rocketry.",
          "Example: SpaceShipOne, the first private crewed spacecraft."
        ]
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
        heading: "Common propellants",
        list: [
          { term: "RP-1 and liquid oxygen", text: "refined kerosene. Dense and easy to store. Used by Falcon 9." },
          { term: "Liquid hydrogen and liquid oxygen", text: "the most efficient chemical combination, but hydrogen is very cold and takes up a lot of space." },
          { term: "Methane and liquid oxygen", text: "a balance between the two, and cleaner burning, which helps reusable engines. Used by Starship." },
          { term: "Hypergolic propellants", text: "ignite on contact without an igniter. Common in spacecraft thrusters." }
        ]
      },
      {
        heading: "Thrust and specific impulse",
        paragraphs: [
          "Thrust is the force an engine produces, measured in newtons or kilonewtons. " +
          "Specific impulse (Isp) measures efficiency, in seconds: how long one kilogram of propellant can produce one kilogram-force of thrust.",
          "A higher Isp means more delta-v from the same amount of propellant. " +
          "Solid motors usually reach about 250 to 290 seconds, kerosene engines about 300 to 350 seconds in vacuum, " +
          "and hydrogen engines about 450 seconds in vacuum."
        ]
      },
      {
        heading: "Engine cycles",
        list: [
          { term: "Pressure-fed", text: "tank pressure pushes the propellant into the chamber. Simple, but limited to low chamber pressure." },
          { term: "Gas generator", text: "a small part of the propellant drives the turbopumps and is then dumped overboard. Used by the Merlin engine." },
          { term: "Staged combustion", text: "the turbine exhaust is sent into the main chamber, so no propellant is wasted. Used by the RD-180 and Raptor." },
          { term: "Expander", text: "heat from cooling the nozzle drives the pumps. Used by the RL10 upper-stage engine." }
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
