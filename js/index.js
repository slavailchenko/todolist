// variables
var $formAddTask = $('#formAddTask'),
	$taskList = $('#task-list'),
	$modalAddTask = $('#modalAddTask'),
	$formEditTask = $('#formEditTask'),
	$modalEditTask = $('#modalEditTask'),
	$btnConfirm = $('#btnConfirm'),
	$modalConfirm = $('#modalConfirm'),
	$deleteTasks = $('#deleteAll'),
	$btnInfo = $('#btnInfo');


// events


//--

$formAddTask.on('submit', function(event) {
	event.preventDefault();
	var task = {
		title: $(this).find('[name=title]').val(),
		status: 1, // 1 - todo, 2 - inprogress, 3 - done
		date: $(this).find('[name=date]').val(),
		description: $(this).find('[name=description]').val()
		
	};

	if (!task.title) {
		$(this).find('[name=title]').parent().addClass('has-error');
		return;
	}
	var key = new Date().getTime();

	localStorage.setItem(key, JSON.stringify(task));
	
	$modalAddTask.modal('hide');
	addTask(task, key);
	
	this.reset();
	countTask();
    
});

//---

$taskList.on('click', '.btn-edit', function() {
	
	var key = $(this).parent().data('id');
	$modalEditTask.modal ('show');
	var task = JSON.parse(localStorage.getItem(key));
	
	$formEditTask.find(`[name="taskId"]`).val(key);

	for (let key in task) {
		$formEditTask.find(`[name="${key}"]`).val(task[key]);
	};
	countTask();
});

$taskList.on('click', '.btn-delete', function() {
	$modalConfirm.modal('show');
	var key = $(this).parent().data('id');
	$modalConfirm.attr('data-key', key);
	countTask();
});

$taskList.on('mousedown', '.btn-info', function() {
	 var key = $(this).parent().data('id');
	 var obj = JSON.parse(localStorage.getItem(key));
	 $(this).attr('data-original-title', obj.date).attr('data-content', obj.description);
	 $('[data-toggle="popover"]').popover();
});

$btnConfirm.on('click', function() {
	var $modal = $(this).parents('.modal');
	var key = $modal.attr('data-key');
	localStorage.removeItem(key);
//	$taskList.find(`[data-id=${key}]`).remove();
	$('[data-id="' + key + '"]').remove();
	$modal.modal('hide');
	countTask();
});



$formEditTask.on('submit', function(event) {
	event.preventDefault();

	var task = {
		title: $(this).find('[name=title]').val(),
		status: $(this).find('[name=status]').val(),
		date: $(this).find('[name=date]').val(),
		description: $(this).find('[name=description]').val()
	}
	
	var key = $(this).find(`[name="taskId"]`).val();
	localStorage.setItem (key, JSON.stringify (task));

	$modalEditTask.modal('hide');
	$taskList.find(`[data-id=${key}]`).remove();
	addTask(task, key);
	countTask();
	
});

// deleteTasks

$deleteTasks.on('click', function(event) {
    event.preventDefault();
	for(var key in localStorage) {
    	if (localStorage.hasOwnProperty(key)) {
      		$('.list-group-item').attr('data-id', key).remove();
    	}
  }
  localStorage.clear();
  countTask();
});



// functions

function addTask(task, key) {
      var $target = $(`[data-status="${task.status}"]`, $taskList);
      	var $btnDelete = $('<button>').addClass('btn btn-danger btn-xs pull-right btn-delete').append('<i class="glyphicon glyphicon-remove"></i>');
      	var $btnEdit = $('<button>').addClass('btn btn-warning btn-xs pull-right btn-edit').append('<i class="glyphicon glyphicon-pencil"></i>');
	var $date = $('<span>').append(task.date).addClass('pull-right').css({
		    'margin-right': '20px'
				  });
	var $btnInfo = $('<button>').addClass('btn btn-info btn-xs pull-right btn-info').attr('data-toggle', 'popover').attr('data-trigger', 'focus')
		.append('<i class="glyphicon glyphicon-info-sign"></i>');

	$('<li>')
		.addClass('list-group-item')
		.text( task.title )
		.attr('data-id', key)
		.appendTo( $target )
		.append($btnDelete)
		.append($btnEdit)
		.append($btnInfo)
		.append($date);

countTask();

}

// function countTask()

function countTask() {
  var willDo = 0,
      doing = 0,
      finished = 0;
      for( var key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          var obj = JSON.parse(localStorage[key]);
          if(obj.status == 1) {
            willDo++;
          }
          else if(obj.status == 2) {
            doing++;
          }
          else if(obj.status == 3) {
            finished++;
          }
          else console.log('error');
        }
      }
    $('[data-which = "1"]').text(willDo);
    $('[data-which = "2"]').text(doing);
    $('[data-which = "3"]').text(finished);
}

//---



// flow



for (let key in localStorage) {
	if (localStorage.hasOwnProperty(key)) {
		let task = JSON.parse(localStorage.getItem(key));
		addTask(task, key);
	}

}

$modalAddTask.on('shown.bs.modal', () => {
	$formAddTask.find('[name="title"]').focus();
	$formAddTask.find('[name=title]').parent().removeClass('has-error');
	$formAddTask[0].reset();
});


$('#sandbox-container input').datepicker ({
  maxViewMode: 2,
  language: "ru",
  autoclose: true,
  orientation: "bottom left",
  format: "yyyy-mm-dd"
});


$(function () {
  $('[data-toggle="popover"]').popover({
  	container: 'body'
  })
})