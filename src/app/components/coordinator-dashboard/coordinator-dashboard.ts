import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

interface Student {
  id: number;
  name: string;
  enrollment: string;
  email: string;
  subject: string;
  professor: string;
  classesToRecover: number;
  reason: string;
  requestDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  scheduledDate?: string;
  scheduledTime?: string;
  assignedComputer?: string;
  assignedRoom?: string;
}

interface Professor {
  id: number;
  name: string;
  subject: string;
  email: string;
  online: boolean;
  avatar: string;
}

interface ChatMessage {
  id: number;
  professorId: number;
  professorName: string;
  message: string;
  timestamp: Date;
  read: boolean;
  isFromCoordinator?: boolean;
}

interface ClassSchedule {
  id: number;
  day: string;
  time: string;
  subject: string;
  professor: string;
  room: string;
  available: boolean;
}

interface Computer {
  id: number;
  number: string;
  room: string;
  available: boolean;
  specifications: string;
}

@Component({
  selector: 'app-coordinator-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './coordinator-dashboard.html',
  styleUrl: './coordinator-dashboard.css'
})
export class CoordinatorDashboard implements OnInit {
  currentUser: any = null;
  
  coordinatorName = 'Carlos Coordenador';
  
  // Estados do componente
  showScheduleModal = false;
  showChatModal = false;
  selectedStudent: Student | null = null;
  selectedProfessor: Professor | null = null;
  
  
  filterStatus: string = 'all';
  
  // Formulários
  selectedSchedule: ClassSchedule | null = null;
  newMessage = '';
  
  // Dados
  students: Student[] = [];
  professors: Professor[] = [];
  chatMessages: ChatMessage[] = [];
  availableSchedules: ClassSchedule[] = [];
  availableComputers: Computer[] = [];
  selectedComputer: Computer | null = null;

  // Signals
  unreadMessages = signal(0);
  pendingRequests = signal(0);

  // Adicionar novas propriedades para modais
  showConfirmModal = false;
  showSuccessModal = false;
  confirmAction: (() => void) | null = null;
  confirmMessage = {
    title: '',
    message: '',
    confirmText: '',
    cancelText: 'Cancelar'
  };
  successMessage = {
    title: '',
    details: [] as { label: string, value: string }[],
    isSuccess: true
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser()();
    this.initializeData();
    this.calculateUnreadMessages();
    this.calculatePendingRequests();
  }

  logout(): void {
    this.authService.logout();
  }

  // Inicialização de dados
  private initializeData(): void {
    // Estudantes solicitando reposição
    this.students = [
      {
        id: 1,
        name: 'João Silva Santos',
        enrollment: 'ADS2024001',
        email: 'joao.silva@email.com',
        subject: 'Programação Web',
        professor: 'Prof. Maria Oliveira',
        classesToRecover: 3,
        reason: 'Problemas de saúde',
        requestDate: new Date(Date.now() - 86400000),
        status: 'pending'
      },
      {
        id: 2,
        name: 'Ana Costa Lima',
        enrollment: 'ADS2024002',
        email: 'ana.costa@email.com',
        subject: 'Banco de Dados',
        professor: 'Prof. Pedro Santos',
        classesToRecover: 2,
        reason: 'Emergência familiar',
        requestDate: new Date(Date.now() - 172800000),
        status: 'pending'
      },
      {
        id: 3,
        name: 'Carlos Mendes',
        enrollment: 'ADS2024003',
        email: 'carlos.mendes@email.com',
        subject: 'Programação Web',
        professor: 'Prof. Maria Oliveira',
        classesToRecover: 4,
        reason: 'Viagem de trabalho',
        requestDate: new Date(Date.now() - 259200000),
        status: 'pending'
      }
    ];

    // Professores
    this.professors = [
      {
        id: 1,
        name: 'Prof. Maria Oliveira',
        subject: 'Programação Web',
        email: 'maria.oliveira@email.com',
        online: true,
        avatar: '👩‍💻'
      },
      {
        id: 2,
        name: 'Prof. Pedro Santos',
        subject: 'Banco de Dados',
        email: 'pedro.santos@email.com',
        online: false,
        avatar: '👨‍💻'
      },
      {
        id: 3,
        name: 'Prof. Ana Costa',
        subject: 'Redes de Computadores',
        email: 'ana.costa@email.com',
        online: true,
        avatar: '👩‍🔬'
      }
    ];

    // Horários disponíveis para reposição
    this.availableSchedules = [
      {
        id: 1,
        day: 'Segunda-feira',
        time: '14:00 - 16:00',
        subject: 'Programação Web',
        professor: 'Prof. Maria Oliveira',
        room: 'Lab 101',
        available: true
      },
      {
        id: 2,
        day: 'Terça-feira',
        time: '10:00 - 12:00',
        subject: 'Banco de Dados',
        professor: 'Prof. Pedro Santos',
        room: 'Lab 102',
        available: true
      },
      {
        id: 3,
        day: 'Quarta-feira',
        time: '16:00 - 18:00',
        subject: 'Programação Web',
        professor: 'Prof. Maria Oliveira',
        room: 'Lab 101',
        available: true
      },
      {
        id: 4,
        day: 'Quinta-feira',
        time: '14:00 - 16:00',
        subject: 'Redes de Computadores',
        professor: 'Prof. Ana Costa',
        room: 'Lab 103',
        available: true
      },
      {
        id: 5,
        day: 'Sexta-feira',
        time: '10:00 - 12:00',
        subject: 'Banco de Dados',
        professor: 'Prof. Pedro Santos',
        room: 'Lab 102',
        available: true
      }
    ];

    // Computadores disponíveis
    this.availableComputers = [
      { id: 1, number: 'PC-01', room: 'Lab 101', available: true, specifications: '' },
      { id: 2, number: 'PC-02', room: 'Lab 101', available: true, specifications: '' },
      { id: 3, number: 'PC-03', room: 'Lab 101', available: false, specifications: '' },
      { id: 4, number: 'PC-04', room: 'Lab 101', available: true, specifications: '' },
      { id: 5, number: 'PC-05', room: 'Lab 102', available: true, specifications: '' },
      { id: 6, number: 'PC-06', room: 'Lab 102', available: true, specifications: '' },
      { id: 7, number: 'PC-07', room: 'Lab 102', available: false, specifications: '' },
      { id: 8, number: 'PC-08', room: 'Lab 103', available: true, specifications: '' },
      { id: 9, number: 'PC-09', room: 'Lab 103', available: true, specifications: '' },
      { id: 10, number: 'PC-10', room: 'Lab 103', available: true, specifications: '' }
    ];

    // Mensagens de chat
    this.chatMessages = [
      {
        id: 1,
        professorId: 1,
        professorName: 'Prof. Maria Oliveira',
        message: 'Olá coordenador, preciso de mais horários para reposições na próxima semana.',
        timestamp: new Date(Date.now() - 3600000),
        read: false
      },
      {
        id: 2,
        professorId: 2,
        professorName: 'Prof. Pedro Santos',
        message: 'O laboratório 102 estará disponível na quinta-feira à tarde.',
        timestamp: new Date(Date.now() - 1800000),
        read: false
      }
    ];
  }

  // Gerenciamento de solicitações
  openScheduleModal(student: Student): void {
    this.selectedStudent = student;
    this.showScheduleModal = true;
    this.selectedSchedule = null;
    this.selectedComputer = null;
  }

  closeScheduleModal(): void {
    this.showScheduleModal = false;
    this.selectedStudent = null;
    this.selectedSchedule = null;
    this.selectedComputer = null;
  }

  approveRequest(): void {
    if (this.selectedStudent && this.selectedSchedule && this.selectedComputer) {
      this.selectedStudent.status = 'approved';
      this.selectedSchedule.available = false;
      this.selectedComputer.available = false;
      
      this.selectedStudent.scheduledDate = this.selectedSchedule.day;
      this.selectedStudent.scheduledTime = this.selectedSchedule.time;
      this.selectedStudent.assignedComputer = this.selectedComputer.number;
      this.selectedStudent.assignedRoom = this.selectedSchedule.room;
      
      const studentInfo = {
        name: this.selectedStudent.name,
        subject: this.selectedStudent.subject,
        day: this.selectedSchedule.day,
        time: this.selectedSchedule.time,
        room: this.selectedSchedule.room,
        computer: this.selectedComputer.number
      };
      
      this.closeScheduleModal();
      this.calculatePendingRequests();
      
      // Mostrar modal de sucesso
      this.showSuccessMessage(
        'Solicitação Aprovada!',
        [
          { label: 'Aluno', value: studentInfo.name },
          { label: 'Matéria', value: studentInfo.subject },
          { label: 'Data', value: studentInfo.day },
          { label: 'Horário', value: studentInfo.time },
          { label: 'Sala', value: studentInfo.room },
          { label: 'Computador', value: studentInfo.computer }
        ],
        true
      );
    } else {
      this.showInfoMessage('Atenção', 'Por favor, selecione um horário e um computador disponível.', false);
    }
  }

  rejectRequest(student?: Student): void {
    const studentToReject = student || this.selectedStudent;
    
    if (studentToReject) {
      // Mostrar modal de confirmação
      this.showConfirmationModal(
        '⚠️ Confirmar Rejeição',
        `Tem certeza que deseja rejeitar a solicitação de reposição de ${studentToReject.name}?\n\nMatéria: ${studentToReject.subject}\nAulas para repor: ${studentToReject.classesToRecover}`,
        'Sim, Rejeitar',
        () => {
          studentToReject.status = 'rejected';
          this.closeScheduleModal();
          this.calculatePendingRequests();
          
          // Mostrar modal de confirmação de rejeição
          this.showSuccessMessage(
            'Solicitação Rejeitada',
            [
              { label: 'Aluno', value: studentToReject.name },
              { label: 'Matéria', value: studentToReject.subject },
              { label: 'Aulas solicitadas', value: studentToReject.classesToRecover.toString() }
            ],
            false
          );
        }
      );
    }
  }

  // Nova função para mostrar modal de confirmação
  showConfirmationModal(title: string, message: string, confirmText: string, onConfirm: () => void): void {
    this.confirmMessage = {
      title,
      message,
      confirmText,
      cancelText: 'Cancelar'
    };
    this.confirmAction = onConfirm;
    this.showConfirmModal = true;
  }

  // Nova função para confirmar ação
  confirmModalAction(): void {
    if (this.confirmAction) {
      this.confirmAction();
    }
    this.closeConfirmModal();
  }

  // Nova função para fechar modal de confirmação
  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.confirmAction = null;
    this.confirmMessage = {
      title: '',
      message: '',
      confirmText: '',
      cancelText: 'Cancelar'
    };
  }

  // Nova função para mostrar mensagem de sucesso
  showSuccessMessage(title: string, details: { label: string, value: string }[], isSuccess: boolean = true): void {
    this.successMessage = { title, details, isSuccess };
    this.showSuccessModal = true;
  }

  // Nova função para mostrar mensagem informativa
  showInfoMessage(title: string, message: string, isSuccess: boolean = false): void {
    this.successMessage = { 
      title, 
      details: [{ label: '', value: message }],
      isSuccess
    };
    this.showSuccessModal = true;
  }

  // Nova função para fechar modal de sucesso
  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.successMessage = { title: '', details: [], isSuccess: true };
  }

  // Chat com professores
  openChatModal(): void {
    this.showChatModal = true;
    this.markAllMessagesAsRead();
  }

  closeChatModal(): void {
    this.showChatModal = false;
    this.selectedProfessor = null;
  }

  selectProfessor(professor: Professor): void {
    this.selectedProfessor = professor;
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedProfessor) return;

    const message: ChatMessage = {
      id: Date.now(),
      professorId: this.selectedProfessor.id,
      professorName: this.coordinatorName,
      message: this.newMessage,
      timestamp: new Date(),
      read: true,
      isFromCoordinator: true
    };

    this.chatMessages.push(message);
    this.newMessage = '';
  }

  // Filtros e cálculos
  getStudentsByStatus(status: string): Student[] {
    return this.students.filter(student => student.status === status);
  }

  getMessagesForProfessor(professorId: number): ChatMessage[] {
    return this.chatMessages.filter(msg => msg.professorId === professorId);
  }

  getAvailableSchedulesForSubject(subject: string): ClassSchedule[] {
    return this.availableSchedules.filter(schedule => 
      schedule.subject === subject && schedule.available
    );
  }

  getAvailableComputersForRoom(room: string): Computer[] {
    return this.availableComputers.filter(computer => 
      computer.room === room && computer.available
    );
  }

  getAvailableComputersForSchedule(schedule: ClassSchedule): Computer[] {
    return this.getAvailableComputersForRoom(schedule.room);
  }

  onScheduleSelected(schedule: ClassSchedule): void {
    this.selectedSchedule = schedule;
    this.selectedComputer = null; // Reset computer selection when schedule changes
  }

  private calculateUnreadMessages(): void {
    this.unreadMessages.set(this.chatMessages.filter(msg => !msg.read).length);
  }

  private calculatePendingRequests(): void {
    this.pendingRequests.set(this.students.filter(s => s.status === 'pending').length);
  }

  private markAllMessagesAsRead(): void {
    this.chatMessages.forEach(msg => msg.read = true);
    this.calculateUnreadMessages();
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      default: return '';
    }
  }

  // Adicionar este método para filtrar estudantes
  getFilteredStudents(): Student[] {
    if (this.filterStatus === 'all') {
      return this.students;
    }
    return this.students.filter(student => student.status === this.filterStatus);
  }

 
  selectStudent(student: Student): void {
    this.selectedStudent = student;
  }
}
