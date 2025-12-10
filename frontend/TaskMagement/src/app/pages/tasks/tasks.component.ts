import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: any[] = [];
  newTask = { title: '', description: '', status: 'pending' };

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((res: any) => {
      this.tasks = res;
    });
  }

  //  ADD TASK WITH SWEETALERT
  addTask() {
    if (!this.newTask.title.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Title Required',
        text: 'Please enter a task title.'
      });
      return;
    }

    Swal.fire({
      title: 'Adding Task...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.taskService.createTask(this.newTask).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Task Added',
          timer: 1200,
          showConfirmButton: false
        });

        this.newTask = { title: '', description: '', status: 'pending' };
        this.loadTasks();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Could not add task.'
        });
      }
    });
  }

  editTask(task: any) {
  Swal.fire({
    title: 'Edit Task',
    html: `
      <input id="edit-title" class="swal2-input" placeholder="Title" value="${task.title}">
      <input id="edit-desc" class="swal2-input" placeholder="Description" value="${task.description}">
      <select id="edit-status" class="swal2-input">
        <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
        <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
      </select>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Update',
    preConfirm: () => {
      const title = (document.getElementById('edit-title') as HTMLInputElement).value;
      const desc = (document.getElementById('edit-desc') as HTMLInputElement).value;
      const status = (document.getElementById('edit-status') as HTMLSelectElement).value;

      if (!title.trim()) {
        Swal.showValidationMessage('Title is required');
        return false;
      }

      return { title, desc, status };
    }
  }).then(result => {
    if (result.isConfirmed) {
      const updatedTask = {
        title: result.value!.title,
        description: result.value!.desc,
        status: result.value!.status
      };

      Swal.fire({
        title: 'Updating...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      this.taskService.updateTask(task.id, updatedTask).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Task Updated',
            timer: 1200,
            showConfirmButton: false
          });
          this.loadTasks();
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Update Failed'
          });
        }
      });
    }
  });
}


  // DELETE TASK WITH CONFIRMATION
  deleteTask(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This task will be deleted permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it'
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          title: 'Deleting...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this.taskService.deleteTask(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted',
              timer: 1200,
              showConfirmButton: false
            });

            this.loadTasks();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed'
            });
          }
        });
      }
    });
  }

  //  MARK COMPLETE WITH ALERT
  markComplete(task: any) {
    Swal.fire({
      title: 'Mark as Completed?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {

        task.status = 'completed';

        Swal.fire({
          title: 'Updating...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this.taskService.updateTask(task.id, task).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Task Completed',
              timer: 1200,
              showConfirmButton: false
            });

            this.loadTasks();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Update Failed'
            });
          }
        });

      }
    });
  }
}
