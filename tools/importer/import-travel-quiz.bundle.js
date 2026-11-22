/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-travel-quiz.js
  var import_travel_quiz_exports = {};
  __export(import_travel_quiz_exports, {
    default: () => import_travel_quiz_default
  });

  // tools/importer/parsers/cards-article.js
  function parse(element, { document }) {
    const makeLink = (src, content) => {
      const a = document.createElement("a");
      a.href = src.href;
      if (typeof content === "string") a.textContent = content;
      else a.append(content);
      return a;
    };
    const cells = [];
    element.querySelectorAll(":scope > .related-articles__item").forEach((item) => {
      const imgLink = item.querySelector("a.related-articles__imglink");
      const img = item.querySelector("img");
      const category = item.querySelector(".related-articles__category a");
      const title = item.querySelector(".related-articles__bodylink a");
      let imageCell = "";
      if (img) {
        const image = document.createElement("img");
        image.src = img.getAttribute("src");
        image.alt = img.getAttribute("alt") || "";
        const href = imgLink || title;
        imageCell = href ? makeLink(href, image) : image;
      }
      const text = [];
      if (category) {
        const p = document.createElement("p");
        p.append(makeLink(category, category.textContent.trim()));
        text.push(p);
      }
      if (title) {
        const p = document.createElement("p");
        p.append(makeLink(title, title.textContent.trim()));
        text.push(p);
      }
      cells.push([imageCell, text]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-hotel-slider.js
  function parse2(element, { document }) {
    const items = [
      ...element.querySelectorAll(".owl-desktop .stay__carditem"),
      ...[...element.querySelectorAll(".stay__carditem")].filter((i) => !i.closest(".owl-desktop"))
    ];
    const seen = /* @__PURE__ */ new Set();
    const cells = [];
    items.forEach((item) => {
      const nameLink = item.querySelector("a.stay__link") || [...item.querySelectorAll("a")].find((a) => a.textContent.trim());
      const img = item.querySelector("img");
      const href = nameLink ? nameLink.href : (item.querySelector("a[href]") || {}).href;
      const key = href || nameLink && nameLink.textContent.trim();
      if (!key || seen.has(key)) return;
      seen.add(key);
      let imageCell = "";
      if (img) {
        const image = document.createElement("img");
        image.src = img.getAttribute("src");
        image.alt = img.getAttribute("alt") || "";
        imageCell = image;
      }
      const p = document.createElement("p");
      if (nameLink) {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = nameLink.textContent.trim();
        p.append(a);
      }
      cells.push([imageCell, p]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-hotel-slider", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-breadcrumb.js
  function parse3(element, { document }) {
    const links = [...element.querySelectorAll("li > a")].filter((a) => a.textContent.trim());
    const cells = [];
    if (links.length) {
      cells.push(links.map((a) => {
        const link = document.createElement("a");
        link.href = a.href;
        link.textContent = a.textContent.trim();
        return link;
      }));
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-breadcrumb", cells });
    element.replaceWith(block);
  }

  // tools/importer/data/riddle-quizzes.js
  var riddle_quizzes_default = {
    "qmN14IJx": {
      "shuffle": true,
      "intro": {
        "grey": true,
        "title": "Where Should You Travel Next?",
        "image": "https://cdn.riddle.com/embeds/v3/images/transformed/w_960,h_540/a0b/a0bc46105525a589e83c60ad8a07c9d0.webp",
        "credit": "Getty Images",
        "start": "Start"
      },
      "questions": [
        {
          "title": "Who do you travel with?",
          "image": "https://cdn.riddle.com/embeds/v3/images/transformed/w_960,h_540/da4/da4c5287570b0d52b52c6a17e5e85dfd.webp",
          "credit": "Getty Images",
          "columns": false,
          "grey": false,
          "maxSelections": 1,
          "answers": [
            {
              "text": "Solo",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Take a Slower Vacation"
              ]
            },
            {
              "text": "With Family",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Reconnect with Loved Ones at an All-Inclusive Resort"
              ]
            },
            {
              "text": "With a Partner",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Celebrate a Milestone with a Luxurious Island Vacation"
              ]
            },
            {
              "text": "With Friends",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Reconnect with Loved Ones at an All-Inclusive Resort"
              ]
            },
            {
              "text": "Alone on Business",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Weekend Getaway"
              ]
            },
            {
              "text": "Depends on the trip",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Plan that Once-in-a-Lifetime Trip"
              ]
            }
          ]
        },
        {
          "title": "What kind of trips are you most interested in taking next year?",
          "image": "https://cdn.riddle.com/embeds/v3/images/transformed/w_960,h_540/cab/cab9c7cacae778bf697216f5d28101c4.webp",
          "credit": "Getty Images",
          "columns": true,
          "grey": true,
          "maxSelections": 1,
          "answers": [
            {
              "text": "Longer visits to one destination",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Take a Slower Vacation (3)"
              ]
            },
            {
              "text": "Far-flung, bucket-list destinations",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Plan that Once-in-a-Lifetime Trip"
              ]
            },
            {
              "text": "Weekend trips and regional adventures",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Weekend Getaway"
              ]
            },
            {
              "text": "Visiting the hottest new luxury resort",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Celebrate a Milestone with a Luxurious Island Vacation"
              ]
            },
            {
              "text": "Exploring new cities",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Take a Slower Vacation"
              ]
            },
            {
              "text": "Outdoor adventures",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Break in Your New Hiking Boots"
              ]
            }
          ]
        },
        {
          "title": "What is your biggest motivation for travel?",
          "image": "https://cdn.riddle.com/embeds/v3/images/transformed/w_960,h_540/9db/9db206aefb922bae8e283e4063b06dc5.webp",
          "credit": "Getty Images",
          "columns": false,
          "grey": false,
          "maxSelections": 1,
          "answers": [
            {
              "text": "Relax and unplug",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Reconnect with Loved Ones at an All-Inclusive Resort"
              ]
            },
            {
              "text": "Immerse yourself in a new place",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Take a Slower Vacation"
              ]
            },
            {
              "text": "Connect with friends or family",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Reconnect with Loved Ones at an All-Inclusive Resort"
              ]
            },
            {
              "text": "Celebrate a milestone",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Celebrate a Milestone with a Luxurious Island Vacation"
              ]
            },
            {
              "text": "Pursue a passion (e.g.learn to cook or hike a new trail)",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Break in Your New Hiking Boots"
              ]
            },
            {
              "text": "Find yourself through travel",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Plan that Once-in-a-Lifetime Trip"
              ]
            }
          ]
        },
        {
          "title": "Which activity sounds most appealing to you?",
          "image": "https://cdn.riddle.com/embeds/v3/images/transformed/w_1707,h_960/91c/91c70954bcc6b4d4092eaa48f837e60b.webp",
          "credit": "Getty Images",
          "columns": false,
          "grey": false,
          "maxSelections": 2,
          "answers": [
            {
              "text": "Cooking class in Tokyo",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Take a Slower Vacation (3)"
              ]
            },
            {
              "text": "Spa weekend in Palm Springs, CA",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Weekend Getaway"
              ]
            },
            {
              "text": "A spontaneous road trip to national parks",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Break in Your New Hiking Boots"
              ]
            },
            {
              "text": "Hiking the Inka Trail to Macchu Picchu",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Plan that Once-in-a-Lifetime Trip"
              ]
            },
            {
              "text": "Discovering a new city",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Weekend Getaway"
              ]
            },
            {
              "text": "Relaxing with your favorite person in your hotel room or suite",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Celebrate a Milestone with a Luxurious Island Vacation"
              ]
            }
          ]
        },
        {
          "title": "What kinds of photos would fill your camera roll on your dream trip?",
          "image": null,
          "credit": "",
          "columns": true,
          "grey": false,
          "maxSelections": 1,
          "answers": [
            {
              "text": "",
              "image": "https://cdn.riddle.com/embeds/v3/images/transformed/w_1440,h_960/c0d/c0de8954a7d37814d40004b5661a8b41.webp",
              "alt": "Friends laughing and splashing in the sea",
              "credit": "Getty Images",
              "results": [
                "Plan that Once-in-a-Lifetime Trip"
              ]
            },
            {
              "text": "",
              "image": "https://cdn.riddle.com/embeds/v3/images/transformed/w_960,h_540/402/402036b7cef492bdda08ee9f4d8e8831.webp",
              "alt": "Shoppers in an ornate glass-roofed galleria",
              "credit": "Getty Images",
              "results": [
                "Weekend Getaway"
              ]
            },
            {
              "text": "",
              "image": "https://cdn.riddle.com/embeds/v3/images/transformed/w_960,h_540/0de/0dec81f1a8f51cb6c655389688cd8773.webp",
              "alt": "Two kayakers on a lake at sunset",
              "credit": "Getty Images",
              "results": [
                "Break in Your New Hiking Boots"
              ]
            },
            {
              "text": "",
              "image": "https://cdn.riddle.com/embeds/v3/images/transformed/w_960,h_540/b6f/b6f0a92f498bc34b6b191644ae5cf8ef.webp",
              "alt": "Hanging chairs on a terrace overlooking the ocean",
              "credit": "Marriott International",
              "results": [
                "Celebrate a Milestone with a Luxurious Island Vacation"
              ]
            },
            {
              "text": "",
              "image": "https://cdn.riddle.com/embeds/v3/images/transformed/w_960,h_540/0bf/0bf019c49f497a374545697c3fae5349.webp",
              "alt": "Group of friends taking a selfie together",
              "credit": "Getty Images",
              "results": [
                "Reconnect with Loved Ones at an All-Inclusive Resort"
              ]
            },
            {
              "text": "",
              "image": "https://cdn.riddle.com/embeds/v3/images/transformed/w_960,h_540/fe9/fe9f6d40682ed6f9d28ed55bd64bd181.webp",
              "alt": "Father and daughter sharing street food at a market",
              "credit": "Getty Images",
              "results": [
                "Take a Slower Vacation"
              ]
            }
          ]
        },
        {
          "title": "Did you travel how you wanted to this year?",
          "image": "https://cdn.riddle.com/embeds/v3/images/transformed/w_960,h_540/806/806a424d1fb4aec27c7b3e0cdc0083e6.webp",
          "credit": "Getty Images",
          "columns": false,
          "grey": true,
          "maxSelections": 1,
          "answers": [
            {
              "text": "No, I wish I took more trips",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Weekend Getaway"
              ]
            },
            {
              "text": "No, I wish I traveled less",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Break in Your New Hiking Boots"
              ]
            },
            {
              "text": "Yes, I traveled as much as I wanted to",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Celebrate a Milestone with a Luxurious Island Vacation"
              ]
            },
            {
              "text": "I traveled some, but I didn't go everywhere I wanted to",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Plan that Once-in-a-Lifetime Trip"
              ]
            },
            {
              "text": "No, I traveled more for business than pleasure",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Reconnect with Loved Ones at an All-Inclusive Resort"
              ]
            },
            {
              "text": "I wanted to take longer, more relaxing trips",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Take a Slower Vacation"
              ]
            }
          ]
        },
        {
          "title": "What was the main reason for your travel pace last year?",
          "image": "https://cdn.riddle.com/embeds/v3/images/transformed/w_960,h_540/5b0/5b0c1850454444d15f8c2c61be370ea5.webp",
          "credit": "Getty Images",
          "columns": false,
          "grey": false,
          "maxSelections": 1,
          "answers": [
            {
              "text": "Budget",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Weekend Getaway"
              ]
            },
            {
              "text": "Time constraints",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Weekend Getaway"
              ]
            },
            {
              "text": "Family or work commitments",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Reconnect with Loved Ones at an All-Inclusive Resort"
              ]
            },
            {
              "text": "Health or safety concerns",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Break in Your New Hiking Boots"
              ]
            },
            {
              "text": "I prioritized other things",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Celebrate a Milestone with a Luxurious Island Vacation"
              ]
            },
            {
              "text": "I was nervous about picking the wrong destination",
              "image": null,
              "alt": "",
              "credit": "",
              "results": [
                "Plan that Once-in-a-Lifetime Trip"
              ]
            }
          ]
        }
      ],
      "results": [
        {
          "title": "Plan that Once-in-a-Lifetime Trip",
          "image": "https://cdn.riddle.com/embeds/v3/images/transformed/w_960,h_540/111/1116082242612f1da8689b0d3d57a5cb.webp",
          "credit": "Getty Images",
          "html": '<p>You keep putting off planning that big trip to somewhere new and exhilarating that you\u2019ve been dreaming about for years. The idea of it makes you nervous. This is the year you will finally take <em>that </em>trip.</p><p>In 2026, travel to <a href="/asia-pacific/tokyo/">Tokyo</a> and stay at <a href="https://www.marriott.com/en-us/hotels/tyogz-courtyard-tokyo-station/overview/">Courtyard by Marriott Tokyo Station</a> to be within walking distance of many city attractions. The hotel is also close to Tokyo Station, giving you convenient access to sites and neighborhoods across the sprawling city and train travel around Japan.</p><p>Or, if you have always dreamed of seeing the Great Wildebeest Migration, set your sights on Serengeti National Park in Tanzania. Stay at <a href="https://www.marriott.com/en-us/hotels/jrosk-mapito-safari-camp-serengeti-autograph-collection/overview/">Mapito Safari Camp, Serengeti, Autograph Collection</a> \u2014 an experience that one guest described as \u201Csimply one of the best experiences of our lives.\u201D</p><p>Use <a href="/travel-tips/how-to-trip-plan-bucket-list/">our guide</a> to turn any wish-list trip into reality.</p>'
        },
        {
          "title": "Take a Slower Vacation",
          "image": "https://cdn.riddle.com/embeds/v3/images/transformed/w_960,h_540/d70/d704e9da50e04dad0d809652686c3487.webp",
          "credit": "Getty Images",
          "html": `<p>In 2026, spend less time flying and more time in each destination to immerse yourself in local culture. Slow down your travels to sample street food, explore local neighborhoods, and connect with locals. You could explore <a href="/europe/london/">London</a> for a year and not see everything this capital city has to offer. Wander London's vibrant neighborhoods full of art, history, culture, markets, and so much more. Rest your head at <a href="https://www.marriott.com/en-us/hotels/lontl-citizenm-tower-of-london">citizenM Tower of London</a>, which is centrally located and offers smart design and communal spaces ideal for mingling on an extended stay.</p><p>Or trade the city for nature and escape to the serene Italian Alps in northwestern Italy. Spend your days skiing the storied Mont Blanc in season, strolling through charming villages, and living like a local at <a href="https://www.marriott.com/en-us/hotels/trnca-le-geant-courmayeur-apartments-bonvoy/overview/">Le Geant, Courmayeur, Apartments by Marriott Bonvoy</a>. Nestled in the famous ski town of Courmayeur, this property offers elevated apartment-style accommodations \u2014 private bedrooms, a spacious living area, a fully equipped kitchen, and even an in-unit washer and dryer \u2014 as well as an on-site spa and fitness center.</p>`
        },
        {
          "title": "Reconnect with Loved Ones at an All-Inclusive Resort",
          "image": "https://cdn.riddle.com/embeds/v3/images/transformed/w_960,h_540/b1e/b1ea5b94b96f1f3af814bf7600034b05.webp",
          "credit": "Getty Images",
          "html": '<p>A vacation is the ideal time to reconnect with the people you love away from the chaos of life. And what is better than rekindling old memories and making new ones in the luxurious comfort and convenience of an all-inclusive resort?</p><p>In 2026, unwind with your loved ones in the sun and sand of <a href="/caribbean-latin-america/cancun/">Cancun</a>, as well as the surrounding areas on the Riviera Maya. Relax at <a href="https://www.marriott.com/en-us/hotels/cunsr-royalton-splash-riviera-cancun-an-autograph-collection-all-inclusive-resort/overview/">Royalton Splash Riviera Cancun, an Autograph Collection All-Inclusive Resort </a>and amp up the fun at the on-site waterpark, Kids Club and delicious buffets.</p><p>Or relax in the natural splendor of <a href="/caribbean-latin-america/costa-rica/">Costa Rica </a>and explore the rainforests, beaches and warm culture. Set in a private forest reserve, <a href="https://www.marriott.com/en-us/hotels/lirwi-the-westin-reserva-conchal-an-all-inclusive-golf-resort-and-spa/overview/">The Westin Reserva Conchal, an All-Inclusive Golf Resort &amp; Spa</a> is an ideal escape featuring a golf course, seven restaurants, the Heavenly Spa, and a pristine white-sand beach.</p>'
        },
        {
          "title": "Weekend Getaway",
          "image": "https://cdn.riddle.com/embeds/v3/images/transformed/w_960,h_540/0b5/0b5cccf18fa448cefb58d92a8cb06f2b.webp",
          "credit": "Getty Images",
          "html": '<p>Life just gets chaotic sometimes, and you can\u2019t seem to make time for a vacation. The good news? You can make the most of your weekends with a <a href="/where-to-travel-next/road-trips/">roadtrip</a> or a quick flight.</p><p>Explore U.S. history and a world-class food scene on a weekend getaway to <a href="/united-states/philadelphia/">Philadelphia</a>. Housed in a stately, circa-1926 historic building, <a href="https://www.marriott.com/en-us/hotels/phlak-the-notary-hotel-philadelphia-autograph-collection/overview/">The Notary Hotel, Philadelphia, Autograph Collection</a> puts you close to all of the main sights in Philly, allowing you to make the most of your weekend of explorations.</p><p>Or take a weekend trip to <a href="/weekend-getaways/savannah-georgia-weekend-guide/">Savannah</a> and enjoy the city\u2019s historic charm, Lowcountry cuisine, and beachfront views. Stay at <a href="https://www.marriott.com/en-us/hotels/savjw-jw-marriott-savannah-plant-riverside-district/overview/">JW Marriott Savannah Plant Riverside District</a>, ideally located on the riverfront and within striking distance of shopping, bars, and restaurants, and unwind at the rooftop pool with sprawling views.</p>'
        },
        {
          "title": "Break in Your New Hiking Boots",
          "image": "https://cdn.riddle.com/embeds/v3/images/transformed/w_960,h_540/07d/07dfcdc53d20ea3693181b7b9c069513.webp",
          "credit": "Marriott International",
          "html": '<p>This is the year to take that nature escape, which can improve your overall well-being. Immerse yourself in the beauty of the Sonoran Desert at <a href="https://www.ritzcarlton.com/en/hotels/tusrz-the-ritz-carlton-dove-mountain/overview/">The Ritz-Carlton, Dove Mountain</a>. Discover 26 miles of scenic hiking and trails in the Tortolita Mountain Preserve and spend your evenings stargazing under the dark sky.</p><p>Or if glamping is more your speed, revel in days spent exploring the trails around Hills Lake and Lake Napowan in Wisconsin\u2019s lake country. Then relax amid the pine trees at <a href="https://www.marriott.com/en-us/hotels/atwwr-postcard-cabins-wild-rose-outdoor-collection-bonvoy/overview/">Postcard Cabins Wild Rose, Outdoor Collection by Marriott Bonvoy</a>, set on 300+ lush acres situated two hours from Milwaukee.</p>'
        },
        {
          "title": "Celebrate a Milestone with a Luxurious Island Vacation",
          "image": "https://cdn.riddle.com/embeds/v3/images/transformed/w_960,h_540/37d/37da3705f2e182f509e77b45109e3eff.webp",
          "credit": "Marriott International",
          "html": '<p>You have a big milestone coming up (important birthday, celebration, job promotion, or just celebrating life), and what better way to commemorate that milestone than a luxurious island adventure. Set your sights on Thailand and the lush island of <a href="/asia-pacific/what-to-do-koh-samui-travel/">Koh Samui</a>, replete with natural wonders, dazzling beaches, and cultural heritage. Reserve a spacious villa at the beachfront <a href="https://www.marriott.com/en-us/hotels/usmwh-w-koh-samui/overview/">W Koh Samui</a> and enjoy its private pools and chic grounds. Relax on the private beach, sip cocktails while taking in dazzling views of the Gulf of Thailand at the hip Wet Deck, and indulge at AWAY Spa.</p><p>Or set your sights on the Hawaiian island of <a href="/weekend-getaways/maui-hawaii-weekend-guide/">Maui</a>, famous for its pristine beaches, wildlife, and Aloha spirit. Situated on an idyllic stretch of the northwest shore, <a href="https://www.ritzcarlton.com/en/hotels/jhmrz-the-ritz-carlton-maui-kapalua/overview/">The Ritz-Carlton Maui, Kapalua</a> is a secluded resort offering access to the island\u2019s most popular attractions, as well as many top-rate experiences on-property. Tee off at one of two 18-hole golf courses, treat yourself at the award-winning spa, delight in the on-site luaus, or let the hotel find another activity to suit your fancy.</p>'
        }
      ]
    }
  };

  // tools/importer/parsers/embed-riddle.js
  function parse4(element, { document }) {
    const iframe = element.querySelector('iframe[src*="riddle.com"]');
    if (!iframe) return;
    const src = iframe.getAttribute("src") || "";
    const href = src.startsWith("//") ? `https:${src.split("?")[0]}` : src.split("?")[0];
    const link = document.createElement("a");
    link.href = href;
    link.textContent = (iframe.getAttribute("title") || "").trim() || href;
    const cells = [[link]];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-riddle", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/quiz.js
  function parse5(element, ctx) {
    const { document } = ctx;
    const iframe = element.querySelector('iframe[src*="riddle.com"]');
    if (!iframe) return;
    const id = (iframe.getAttribute("src") || "").split("?")[0].split("/").pop();
    const quiz = riddle_quizzes_default[id];
    if (!quiz) {
      parse4(element, ctx);
      return;
    }
    const el = (tag, text) => {
      const node = document.createElement(tag);
      if (text) node.textContent = text;
      return node;
    };
    const media = (src, alt, credit) => {
      const cell = document.createElement("div");
      if (!src) return "";
      const img = el("img");
      img.src = src;
      img.alt = alt || "";
      cell.append(img);
      if (credit) {
        const p = el("p");
        p.append(el("em", credit));
        cell.append(p);
      }
      return cell;
    };
    const content = (...nodes) => {
      const cell = document.createElement("div");
      cell.append(...nodes);
      return cell;
    };
    const rows = [];
    const { intro } = quiz;
    const type = (name, opts) => opts.length ? `${name} (${opts.join(", ")})` : name;
    rows.push([type("Intro", intro.grey ? ["grey"] : []), media(intro.image, "", intro.credit), content(el("h2", intro.title), el("p", intro.start))]);
    quiz.questions.forEach((q) => {
      const list = el("ul");
      q.answers.forEach((a) => {
        const li = el("li");
        if (a.image) {
          const img = el("img");
          img.src = a.image;
          img.alt = a.alt;
          li.append(img);
          if (a.credit) li.append(el("em", a.credit));
        } else {
          li.append(a.text);
        }
        const scores = el("ul");
        a.results.forEach((r) => scores.append(el("li", r)));
        li.append(scores);
        list.append(li);
      });
      const nodes = [el("h3", q.title)];
      if (q.maxSelections > 1) nodes.push(el("p", `Choose up to ${q.maxSelections}`));
      nodes.push(list);
      rows.push([type("Question", [q.columns && "columns", q.grey && "grey"].filter(Boolean)), media(q.image, "", q.credit), content(...nodes)]);
    });
    quiz.results.forEach((r) => {
      const body = document.createElement("div");
      body.innerHTML = r.html;
      rows.push(["Result", media(r.image, "", r.credit), content(el("h3", r.title), ...body.childNodes)]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "quiz", variants: quiz.shuffle ? ["shuffle"] : [], cells: rows });
    element.replaceWith(block);
  }

  // tools/importer/transformers/marriott-cleanup.js
  var removeAll = (root, selectors) => {
    selectors.forEach((sel) => {
      root.querySelectorAll(sel).forEach((el) => el.remove());
    });
  };
  function transform(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      removeAll(element, [
        "header.header-template-part.wp-block-template-part",
        "footer.wp-block-template-part",
        "#onetrust-consent-sdk",
        "li.teconsent-default-link",
        ".litepicker",
        ".wp-block-traveler-fse-blocks-knotch",
        ".knotch_placeholder",
        '[id^="batBeacon"]',
        '[id^="ttdUniversalPixelTag"]',
        "img.ywa-10000"
      ]);
      element.querySelectorAll("iframe").forEach((iframe) => {
        if (!iframe.closest("section.riddle-quiz")) iframe.remove();
      });
      removeAll(element, [
        ".post-content .wp-block-spacer",
        ".wp-block-spacer",
        ".article-hero__imgauthor"
      ]);
      element.querySelectorAll(".stay__button a").forEach((a) => {
        const doc = a.ownerDocument;
        const u = doc.createElement("u");
        u.textContent = a.textContent.trim();
        a.replaceChildren(u);
        const strong = doc.createElement("strong");
        a.replaceWith(strong);
        strong.append(a);
      });
      element.querySelectorAll(".custom-breadcrumb li > span").forEach((span) => {
        if (span.querySelector("img")) span.remove();
      });
      const stay = element.querySelectorAll("aside.stay, .wp-block-traveler-fse-blocks-highlight.stay");
      stay.forEach((s) => {
        removeAll(s, [
          "button.prev-btn",
          "button.next-btn",
          ".owl-nav",
          ".owl-dots",
          ".stay__num",
          ".stay__count",
          ".owl-item.cloned",
          "hr.stay__seperator"
        ]);
        const desktop = s.querySelector(".owl-carousel.owl-desktop");
        if (desktop && desktop.querySelector(".stay__carditem")) {
          s.querySelectorAll(".owl-carousel.owl-mobile").forEach((m) => m.remove());
        }
      });
    }
    if (hookName === "afterTransform") {
      removeAll(element, ["script", "style", "noscript", "link", "button"]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach(({ name }) => {
          if (name.startsWith("data-track") || name.startsWith("data-analytics") || name === "onclick") {
            el.removeAttribute(name);
          }
        });
      });
    }
  }

  // tools/importer/transformers/marriott-sections.js
  var MARKER = "data-excat-section-id";
  var findSection = (root, section) => {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    for (const sel of selectors) {
      if (!sel) continue;
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  };
  function transform2(hookName, element, payload) {
    var _a;
    const sections = (_a = payload == null ? void 0 : payload.template) == null ? void 0 : _a.sections;
    if (!sections || sections.length < 2) return;
    const document = element.ownerDocument;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const el = findSection(element, section);
        if (!el) continue;
        if (i > 0 || section.style) {
          const hr = document.createElement("hr");
          if (section.style) hr.setAttribute(MARKER, section.id);
          if (i === 0) hr.setAttribute("data-excat-first", "true");
          el.before(hr);
        }
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`hr[${MARKER}="${section.id}"]`);
        const block = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        const el = findSection(element, section);
        if (el) {
          el.after(block);
        } else if (marker) {
          let last = marker;
          while (last.nextElementSibling && last.nextElementSibling.tagName !== "HR") {
            last = last.nextElementSibling;
          }
          last.after(block);
        }
        if (marker) {
          if (marker.hasAttribute("data-excat-first")) marker.remove();
          else marker.removeAttribute(MARKER);
        }
      }
    }
  }

  // tools/importer/import-travel-quiz.js
  var PAGE_TEMPLATE = {
    "name": "travel-quiz",
    "urls": [
      "https://traveler.marriott.com/travel-quiz/quiz-where-to-travel-next-year/"
    ],
    "representativeUrl": "https://traveler.marriott.com/travel-quiz/quiz-where-to-travel-next-year/",
    "description": "Travel quiz articles: breadcrumb, article hero, intro copy with an embedded Riddle quiz, Where to Stay hotel slider and related articles.",
    "blocks": [
      {
        "name": "columns-breadcrumb",
        "instances": [
          ".custom-breadcrumb"
        ]
      },
      {
        "name": "quiz",
        "instances": [
          "section.riddle-quiz",
          ".riddle2-wrapper"
        ]
      },
      {
        "name": "cards-hotel-slider",
        "instances": [
          ".stay__cards"
        ]
      },
      {
        "name": "cards-article",
        "instances": [
          ".related-articles__items"
        ]
      }
    ],
    "urlPattern": "/travel-quiz/*",
    "sections": [
      {
        "id": "rc1",
        "name": "Breadcrumb",
        "selector": [
          ".custom-breadcrumb"
        ],
        "style": null,
        "blocks": [
          "columns-breadcrumb"
        ],
        "defaultContent": []
      },
      {
        "id": "rc2",
        "name": "Article hero",
        "selector": [
          "section.article-hero"
        ],
        "style": "centered",
        "blocks": [],
        "defaultContent": [
          ".article-hero__category",
          ".article-hero__title",
          ".article-hero__author",
          ".article-hero__img",
          ".article-hero__imgdesc"
        ]
      },
      {
        "id": "rc3c1",
        "name": "Article intro and quiz",
        "selector": [
          ".post-content.article-data"
        ],
        "style": null,
        "blocks": [
          "quiz"
        ],
        "defaultContent": [
          ".post-content.article-data > p"
        ]
      },
      {
        "id": "rc3c2",
        "name": "Where to Stay",
        "selector": [
          "aside.stay",
          ".wp-block-traveler-fse-blocks-highlight.stay"
        ],
        "style": "centered",
        "blocks": [
          "cards-hotel-slider"
        ],
        "defaultContent": [
          ".stay__heading",
          ".stay__title",
          ".stay__button"
        ]
      },
      {
        "id": "rc3c3",
        "name": "Related Articles",
        "selector": [
          "section.related-articles"
        ],
        "style": "centered",
        "blocks": [
          "cards-article"
        ],
        "defaultContent": [
          ".related-articles__heading"
        ]
      }
    ]
  };
  var parsers = {
    "columns-breadcrumb": parse3,
    "quiz": parse5,
    "cards-hotel-slider": parse2,
    "cards-article": parse
  };
  var sectionTransformers = [transform2];
  var fragmentTransformers = [];
  var lateTransformers = [...sectionTransformers, ...fragmentTransformers];
  var correctionTransformers = [];
  var transformers = [transform, ...lateTransformers, ...correctionTransformers];
  var earlyTransformers = transformers.filter((fn) => !lateTransformers.includes(fn));
  var CATALOG = Boolean(PAGE_TEMPLATE.pageCleanup || PAGE_TEMPLATE.blocks.some((b) => b.pageInstances));
  function executeTransformers(hookName, element, payload, list = transformers) {
    var _a, _b;
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: ((_b = (_a = payload.params) == null ? void 0 : _a.targets) == null ? void 0 : _b.template) || PAGE_TEMPLATE });
    list.forEach((fn) => {
      try {
        fn(hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template, url) {
    const pageBlocks = [];
    const pageKey = (u) => {
      try {
        const { origin, pathname } = new URL(u);
        return `${origin}${pathname.replace(/\/$/, "")}`;
      } catch (e) {
        return u;
      }
    };
    const key = pageKey(url);
    const claim = (blockDef, selector) => {
      let matches = [];
      try {
        matches = document.querySelectorAll(selector);
      } catch (e) {
        return;
      }
      matches.forEach((element) => {
        if (pageBlocks.some((b) => b.element === element || b.element.contains(element) || element.contains(b.element))) return;
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    };
    template.blocks.forEach((blockDef) => {
      const entry = Object.entries(blockDef.pageInstances || {}).find(([u]) => pageKey(u) === key);
      (entry ? entry[1] : []).forEach((selector) => claim(blockDef, selector));
    });
    template.blocks.forEach((blockDef) => (blockDef.instances || []).forEach((selector) => claim(blockDef, selector)));
    return pageBlocks;
  }
  function markPageTargets(payload) {
    const { document, params } = payload;
    executeTransformers("beforeTransform", document.body, payload, earlyTransformers);
    const blocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL).map(({ name, selector, element }, i) => {
      element.setAttribute("data-excat-block", String(i));
      return { name, selector };
    });
    const sections = (PAGE_TEMPLATE.sections || []).map((section, i) => {
      const target = (section.selector || []).map((s) => {
        try {
          return document.querySelector(s);
        } catch (e) {
          return null;
        }
      }).find(Boolean);
      if (!target) return section;
      target.setAttribute("data-excat-section", String(i));
      return __spreadProps(__spreadValues({}, section), { selector: [`[data-excat-section="${i}"]`] });
    });
    params.targets = { blocks, template: __spreadProps(__spreadValues({}, PAGE_TEMPLATE), { sections }) };
  }
  var import_travel_quiz_default = {
    preprocess: (payload) => {
      if (CATALOG) markPageTargets(payload);
    },
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      params.fragments = [];
      if (!params.targets) markPageTargets(payload);
      const pageBlocks = params.targets.blocks.map((block, i) => __spreadProps(__spreadValues({}, block), { element: document.querySelector(`[data-excat-block="${i}"]`) })).filter((block) => block.element);
      executeTransformers("beforeTransform", main, __spreadProps(__spreadValues({}, payload), { pageBlocks }), lateTransformers);
      pageBlocks.forEach((block) => {
        if (!main.contains(block.element)) return;
        const parser = parsers[block.name];
        if (!parser) return;
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      });
      executeTransformers("afterTransform", main, payload);
      main.appendChild(document.createElement("hr"));
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      params.fragments.forEach(({ element }) => {
        executeTransformers("afterTransform", element, payload, earlyTransformers);
        WebImporter.rules.transformBackgroundImages(element, document);
        WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
      });
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }, ...params.fragments];
    }
  };
  return __toCommonJS(import_travel_quiz_exports);
})();
