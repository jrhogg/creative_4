var app = new Vue({
  el: '#app',
  data: {
    items: [],
    text: '',
    show: 'all',
    drag: {},
    priority: 'High',
    month: 'January',
    day: 1,
  },
  created: function() {
    this.getItems();
  },
  computed: {
    activeItems: function() {
      return this.items.filter(function(item) {
	return !item.completed;
      });
    },
    filteredItems: function() {
      if (this.show === 'active')
	return this.items.filter(function(item) {
	  return !item.completed;
	});
      if (this.show === 'completed')
	return this.items.filter(function(item) {
	  return item.completed;
	});
      return this.items;
    },
  },
  methods: {
    getItems: function() {
      axios.get("/api/items").then(response => {
        this.items = response.data;
        return true;
      }).catch(err => {
      });
    },
    addItem: function() {
      axios.post("/api/items", {
        text: this.text,
        completed: false,
        day: this.day,
        month: this.month,
      }).then(response => {
        this.text = "";
        this.month = 'January';
        this.day = 1;
        this.getItems();
        return true;
      }).catch(err => {
      });
    },
    completeItem: function(item) {
      axios.put("/api/items/" + item.id, {
	text: item.text,
        priority: item.priority,
	completed: !item.completed,
	orderChange: false,
      }).then(response => {
	return true;
      }).catch(err => {
      });
    },
    deleteItem: function(item) {
      axios.delete("/api/items/" + item.id).then(response => {
	this.getItems();
	return true;
      }).catch(err => {
      });
    },
    showAll: function() {
      this.show = 'all';
    },
    showActive: function() {
      this.show = 'active';
    },
    showCompleted: function() {
      this.show = 'completed';
    },
    deleteCompleted: function() {
      this.items.forEach(item => {
	if (item.completed)
	  this.deleteItem(item)
      });
    },
    dragItem: function(item) {
      this.drag = item;
    },
    dropItem: function(item) {
      axios.put("/api/items/" + this.drag.id, {
	text: this.drag.text,
	completed: this.drag.completed,
        priority: this.drag.priority,
	orderChange: true,
	orderTarget: item.id
      }).then(response => {
	this.getItems();
	return true;
      }).catch(err => {
      });
    },
    sortPrior: function(){
      this.items.sort(function(a,b){
        if(app.getMonth(a.month) === app.getMonth(b.month))
          return a.day-b.day;
        else return app.getMonth(a.month) - app.getMonth(b.month);
      });
      axios.put("/api/items/" +this.items[0].id,{
         sort: true,
         temp: this.items
        }).then(response =>{
          return true;
        }).catch(err =>{
      });
      this.getItems();
    },
    updateItems: function() {
      for(var i = 0; i < this.items.length;i++){
       axios.put("/api/items/" + this.items[i].id, {
          id:this.items[i].id,
          text: this.items[i].text,
          priority: this.items[i].priority,
          completed: this.items[i].completed,
        }).then(response =>{
          return true;
        }).catch(err =>{
       });
       }
     },
     getMonth: function(monthString){
       if(monthString === 'January')
         return 0;
       if(monthString === 'February')
         return 1;
       if(monthString === 'March')
         return 2;
       if(monthString === 'April')
         return 3;
       if(monthString === 'May')
         return 4;
       if(monthString === 'June')
         return 5;
       if(monthString === 'July')
         return 6;
       if(monthString === 'August')
         return 7;
       if(monthString === 'September')
         return 8;
       if(monthString === 'October')
         return 9;
       if(monthString === 'November')
         return 10;
       if(monthString === 'December')
         return 11;
    },
  }
});
