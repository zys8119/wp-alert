function resolver() {
    return [
        (name) => {
            if (/^Alert/.test(name)) {
                return {
                    name,
                    from:'wp-alert'
                }
            }
        }
    ]
}

module.exports = {
    resolver
}
