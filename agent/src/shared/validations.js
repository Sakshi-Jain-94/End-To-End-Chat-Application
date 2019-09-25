/* eslint-disable no-useless-escape */
/* eslint-disable max-len */
const Validate = {
    email(input, validateChar) {
        if (validateChar) {
            return true;
        }
        if (input.length > 96) {
            return false;
        }
        const re = /.+@.+[.]([a-zA-Z]){2,3}/;
        return re.test(input);
    },
    telephone(input, validateChar) {
        if (validateChar) {
            const re = /[0-9]$/;
            return re.test(input);
        }
        const re = /^[1-9][0-9]{9}$/;
        return re.test(input);
    },
};

export default Validate;
