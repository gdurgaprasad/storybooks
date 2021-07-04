const moment = require('moment')

module.exports = {
    formatDate: (date) => moment(date).calendar(),
    formatTitle: (value) => value.replace(/(^|\s)\S/g, function (t) { return t.toUpperCase() }),
    truncate: (string, length) => {
        if (string.length > 0 && string.length > length) {
            let newString = `${string} `
            newString = string.substr(0, length);
            newString = string.substr(0, newString.lastIndexOf(' '))
            newString = newString.length > 0 ? newString : string.substr(0, length);
            return `${newString}...`
        }
        return string
    },
    stripTags: (input) => input.replace(/<(?:.|\n)*?>/gm, ''),
    editIcon: (storyUser, loggedUser, storyId, floating = true) => {
        if (storyUser._id.toString() === loggedUser._id.toString()) {
            if (floating) {
                return `<a href="/stories/edit/${storyId}" class="z-depth-4 btn-floating halfway-fab pink"><i class="fas fa-edit fa-small"></i></a>`
            } else {
                return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
            }
        } else {
            return ''
        }
    },
    select: (selected, options) => {
        return options.fn(this)
            .replace(new RegExp(' value="' + selected + '"'), '$& selected="selected"')
            .replace(new RegExp('>' + selected + '</option>'), ' selected="selected"$&')
    }

}