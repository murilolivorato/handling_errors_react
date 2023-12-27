class Errors {
    constructor () {
        this.errors = {}
    }

    // GET ERRRO
    get (field) {
        // IF IS AN ARRAY ERROR
        if (field.includes('.')) {
            const splitString = field.split('.')

            // IT IS AN ARRAY FORM  -> FORM.IMAGE_GALLERY.0.IMAGES
            if (splitString.length === 4) {
                // LARAVEL FORM ERROR
                const errorOne = this.errors[splitString[0]][splitString[1]][splitString[2] + '.' + splitString[3]]
                if (errorOne) {
                    return errorOne
                }

                if (this.errors[splitString[0]][splitString[1]][splitString[2]][splitString[3]]) {
                    return this.errors[splitString[0]][splitString[1]][splitString[2]][splitString[3]][0]
                }
            }

            // IT IS AN ARRAY FORM  -> FORM.IMAGE_GALLERY.IMAGES
            if (splitString.length === 3) {
                // LARAVEL FORM ERROR
                const errorOne = this.errors[splitString[0]][splitString[1] + '.' + splitString[2]]
                if (errorOne) {
                    return errorOne
                }

                if (this.errors[splitString[0]][splitString[1]][splitString[2]]) {
                    return this.errors[splitString[0]][splitString[1]][splitString[2]][0]
                }
            }

            // ADD ERROR INSIDE ARRAY LIST -> FORM.TITLE
            if (this.errors[splitString[0]][splitString[1]]) {
                return this.errors[splitString[0]][splitString[1]][0]
            }

            return false
        }

        // VALIDATE WITH NO FORM REFRENCE -> TITLE
        if (this.errors[field]) {
            return this.errors[field][0]
        }
    }

    record (errors, list = null) {
        this.clear()
        console.log('vali salvarrrrrrrrrr')
        if (list) {
            this.errors = [list]
            this.errors[list] = errors
            return
        }

        this.errors = errors
    }

    // RESET RECORDS
    reset () {
        this.errors = {}
    }

    // ANY
    any () {
        return Object.keys(this.errors).length > 0
    }

    // HAS
    has (field) {
        // IF IS AN ARRAY ERROR
        if (field.includes('.')) {
            const splitString = field.split('.')

            if ({}.hasOwnProperty.call(this.errors, splitString[0])) {
                // IT IS AN ARRAY FORM  -> FORM.IMAGE_GALLERY.0.IMAGES
                if (splitString.length === 4) {
                    if ({}.hasOwnProperty.call(this.errors[splitString[0]][splitString[1]], splitString[2])) {
                        // LARAVEL FORM ERROR
                        const errorOne = this.errors[splitString[0]][splitString[1]][splitString[2] + '.' + splitString[3]]
                        if (errorOne) {
                            return errorOne
                        }

                        // MY FORM ERROR
                        return {}.hasOwnProperty.call(this.errors[splitString[0]][splitString[1]][splitString[2]], splitString[3])
                    }
                    return false
                }

                // IT IS AN ARRAY FORM  -> FORM.IMAGE_GALLERY.IMAGES
                if (splitString.length === 3) {
                    // LARAVEL FORM ERROR
                    const errorOne = this.errors[splitString[0]][splitString[1] + '.' + splitString[2]]
                    console.log('errorOne', errorOne)
                    if (errorOne) {
                        return errorOne
                    }
                    // MY FORM ERROR

                    // IT HAS FORM REFERENCE  -> FORM.TITLE
                    const data = {}.hasOwnProperty.call(this.errors[splitString[0]], splitString[1])
                    if (!data) {
                        return false
                    }
                    return {}.hasOwnProperty.call(this.errors[splitString[0]][splitString[1]], splitString[2])
                }

                // IT HAS FORM REFERENCE  -> FORM.TITLE
                return {}.hasOwnProperty.call(this.errors[splitString[0]], splitString[1])
            }

            return false
        }

        // DOES NOT HAVA FORM REFERENCE  -> TITLE
        return {}.hasOwnProperty.call(this.errors, field)
    }

    // CLEAR
    clear (field) {
        if (field) delete this.errors[field]

        this.errors = {}
    }

    // VERIFY ERROR AND CLEAR
    verifyErrorAndClear (field) {
        if (this.has(field)) {
            this.clearField(field)
        }
    }

    // CLEAR FIELD
    clearField (field) {
        // HAS ARRAY ERROR
        if (field.includes('.')) {
            const splitString = field.split('.')
            const listName = splitString[0]
            const fieldName = splitString[1]

            delete this.errors[listName][fieldName]
            return
        }

        delete this.errors[field]
    }
}

export default Errors
