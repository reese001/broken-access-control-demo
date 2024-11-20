// Mongo shell commands here to seed MongoDB database
// ...
db.photos.drop();

db.photos.insertMany([
    {
        photos: [
            {
                id: "1",
                title: "Rawdon River Bridge",
                caption: "Our little bridge after an ice storm",
                source: "winterBridge.jpg",
                width: "375",
                height: "500",
                comments: [
                    {
                        comment: "And another comment added!",
                        author: "Sean Morrow",
                    },
                    {
                        comment: "For testing purposes of course ;)",
                        author: "This is a new comment added here!",
                    },
                ],
            },
            {
                id: "2",
                title: "Canoeing and Camping",
                caption:
                    "Camping deep in the interior of Algonquin Provincial Park",
                source: "algonquinPark.jpg",
                width: "375",
                height: "500",
                comments: [
                    {
                        comment: "Josh was here!",
                        author: "Some guy",
                    },
                ],
            },
            {
                id: "3",
                title: "Saturday at the Beach",
                caption:
                    "Getting in some beach fun at White Point Beach Resort",
                source: "beach.jpg",
                width: "500",
                height: "375",
                comments: [
                    {
                        comment: "and another comment here",
                        author: "another guy",
                    },
                    {
                        comment: "Some comments added to this picture :P",
                        author: "Some Guy",
                    },
                ],
            },
            {
                id: "4",
                title: "Rainy Day",
                caption:
                    "Rainy day on the shores of Bras d`Or Lake in Cape Breton",
                source: "capeBreton.jpg",
                width: "375",
                height: "500",
                comments: [],
            },
            {
                id: "5",
                title: "Fall is here!",
                caption: "Taking in the fall colours at the top of Wentworth",
                source: "fallColours.jpg",
                width: "375",
                height: "500",
                comments: [
                    {
                        comment: "Take this picture down now!",
                        author: "Annonymous",
                    },
                ],
            },
            {
                id: "6",
                title: "Final Work Experience Debrief",
                caption: "The graduating IT class of NSCC, Truro Campus",
                source: "itGrads.jpg",
                width: "500",
                height: "375",
                comments: [],
            },
            {
                id: "7",
                title: "Bottom of the Sea View",
                caption:
                    "An amazing aquarium right at the base of the CN Tower",
                source: "ripleysAquarium.jpg",
                width: "500",
                height: "375",
                comments: [],
            },
            {
                id: "10",
                title: "Hitting the Hill",
                caption:
                    "Minus twenty degrees celsius and we are still on the hill!",
                source: "wentworth.jpg",
                width: "500",
                height: "375",
                comments: [],
            },
            {
                id: "11",
                title: "Camping along the Rocks",
                caption: "Best camping spot ever!",
                source: "camping.jpg",
                width: "500",
                height: "375",
                comments: [],
            },
            {
                id: "14",
                title: "Stay off the Black Rocks!",
                caption:
                    "Warning sign posted at Peggy`s Cove for foolish tourists",
                source: "peggysCove.jpg",
                width: "500",
                height: "375",
                comments: [],
            },
            {
                id: "15",
                title: "Altitude Sickness",
                caption:
                    "The long climb up Jacob`s Ladder in Victoria Park, Truro",
                source: "jacobsLadder.jpg",
                width: "375",
                height: "500",
                comments: [
                    {
                        comment: "first posting!",
                        author: "testing dude",
                    },
                ],
            },
        ],
    },
]);
