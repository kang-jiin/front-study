var Items = (function () {
    var mode = "all";
    var items = [];

    return {
        setMode: function (data) {
            mode = data;
        },

        getViewItems: function () {
            switch (mode) {
                case "active": {
                    return items.filter(function (item) {
                        return item.isCompleted === false;
                    });
                }
                case "completed": {
                    return items.filter(function (item) {
                        return item.isCompleted === true;
                    });
                }
                default: { // all
                    return items;
                }
            }
        },

        getActiveCount: function () {
            return items.filter(function (item) {
                return item.isCompleted === false;
            }).length;
        },

        getCompletedCount: function () {
            return items.filter(function (item) {
                return item.isCompleted === true;
            }).length;
        },

        setUpdating: function (id) {
            items = items.map(function (item) {
                return {
                    id: item.id,
                    content: item.content,
                    isCompleted: item.isCompleted,
                    isUpdating: item.id == id ? true : false
                };
            });
        },

        addItem: function (content) {
            var item = {
                id: new Date().getTime(),
                content: content,
                isCompleted: false,
                isUpdating: false
            };
            items = items.concat([item]);
        },

        updateItem: function (id, content) {
            items = items.map(function (item) {
                return {
                    id: item.id,
                    content: item.id == id ? content : item.content,
                    isCompleted: item.isCompleted,
                    isUpdating: false
                };
            });
        },

        deleteItem: function (id) {
            items = items.filter(function (item) {
                return item.id != id;
            });
        },

        deleteCompletedAll: function () {
            items = items.filter(function (item) {
                return item.isCompleted === false;
            });
        },

        toggleCompleted: function (id) {
            var item = items.find(function (item) {
                return item.id == id;
            })
            item.isCompleted = !item.isCompleted;
        },

        toggleCompletedAll: function () {
            var isCheck = this.isCheckAll();
            items = items.map(function (item) {
                return {
                    id: item.id,
                    content: item.content,
                    isCompleted: !isCheck,
                    isUpdating: false
                };
            })
        },

        isCheckAll: function () {
            return items.length > 0 &&
                items.filter(function (item) {
                    return item.isCompleted === true;
                }).length === items.length;
        }
    };
})();