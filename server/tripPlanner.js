/* eslint-disable no-console */
/* eslint-disable max-len */
module.exports = {
    start() {
        return {
            showInput: false,
            actionType: 'button',
            text: [
                "Hey! I'm Your Trip Planner...",
                'Are you looking for help in planning your trip?',
            ],
            actions: [
                { text: 'Yes! A romantic trip', intent: 'romantic' },
                { text: 'Yes! For a family trip', intent: 'family' },
                { text: 'Yes! For a trip with friends', intent: 'friends' },
                { text: 'Yes! For a solo trip', intent: 'solo' },
                { text: 'Yes! For a adventurous trip', intent: 'adventurous' },
            ],
        };
    },
    romantic() {
        return {
            showInput: false,
            actionType: 'button',
            text: [
                'Have you selected your destination?',
            ],
            actions: [
                { text: 'Yes', intent: 'romanticYes' },
                { text: 'No', intent: 'romanticNo' },
            ],
        };
    },
    romanticYes() {
        return {
            showInput: true,
            actionType: 'input',
            inputConfig: {
                placeholder: 'Type your destination ...',
            },
            text: [
                'Please Enter your destination',
            ],
            actions: [
                { text: null, intent: 'askDuration' },
            ],
        };
    },
    romanticNo() {
        return {
            showInput: false,
            actionType: 'button',
            text: [
                'Please select category for your trip',
            ],
            actions: [
                { text: 'Domestic Holidays', intent: 'rmtDom' },
                { text: 'International Holidays', intent: 'rmtInt' },
            ],
        };
    },
    rmtDom() {
        return {
            showInput: false,
            actionType: 'button',
            text: [
                'Are you interested in any of these destinations?',
            ],
            actions: [
                { text: 'Kashmir', intent: 'askDuration' },
                { text: 'Darjeeling - Gangtok', intent: 'askDuration' },
                { text: 'Kerala', intent: 'askDuration' },
                { text: 'Goa', intent: 'askDuration' },
                { text: 'Shimla - Kullu', intent: 'askDuration' },
                { text: 'Leh - Ladakh', intent: 'askDuration' },
                { text: 'Others', intent: 'romanticYes' },
            ],
        };
    },
    rmtInt() {
        return {
            showInput: false,
            actionType: 'button',
            text: [
                'Are you interested in any of these destinations?',
            ],
            actions: [
                { text: 'Bhutan', intent: 'askDuration' },
                { text: 'Nepal', intent: 'askDuration' },
                { text: 'Sri Lanka', intent: 'askDuration' },
                { text: 'Singapore - Bali', intent: 'askDuration' },
                { text: 'Mauritius', intent: 'askDuration' },
                { text: 'Switzerland', intent: 'askDuration' },
                { text: 'Seychelles', intent: 'askDuration' },
                { text: 'Others', intent: 'romanticYes' },
            ],
        };
    },
    askDuration() {
        return {
            showInput: false,
            actionType: 'button',
            text: [
                'Please Select your duration',
            ],
            actions: [
                { text: '3 Nights / 4 Days', intent: 'askBudget' },
                { text: '4 Nights / 5 Days', intent: 'askBudget' },
                { text: '5 Nights / 6 Days', intent: 'askBudget' },
                { text: '> 6 Nights', intent: 'askBudget' },
            ],
        };
    },
    askBudget() {
        return {
            showInput: false,
            actionType: 'button',
            text: [
                'Please Select your budget',
            ],
            actions: [
                { text: '< 50,000', intent: 'askForContact' },
                { text: '50,000 - 1 Lac', intent: 'askForContact' },
                { text: '>1 Lac', intent: 'askForContact' },
                { text: 'Others', intent: 'askForContact' },
            ],
        };
    },
    askForContact() {
        return {
            showInput: true,
            actionType: 'input',
            inputConfig: {
                type: 'telephone',
                maxLength: 10,
                placeholder: 'Enter your mobile number...',
            },
            text: [
                'Please share your contact details so that we can connect to you with your desired trip details',
            ],
            actions: [
                { text: null, intent: 'end' },
            ],
        };
    },
};
