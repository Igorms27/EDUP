import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth';



interface Student {
  id: number;
  name: string;
  enrollment: string;
  email: string;
  grade: number;
  absences: number;
  maxAbsences: number;
  classesToRecover: number;
  status: 'approved' | 'recovery' | 'failed';
}

interface Class {
  id: number;
  name: string;
  students: Student[];
  schedule: string;
  room: string;
}

interface ChatMessage {
  id: number;
  studentId: number;
  studentName: string;
  message: string;
  timestamp: Date;
  read: boolean;
  isFromProfessor?: boolean;
}

@Component({
  selector: 'app-professor-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './professor-dashboard.html',
  styleUrl: './professor-dashboard.css'
})
export class ProfessorDashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);

  currentUser: User | null = null;
  
  professorName = 'Prof. Maria Oliveira';
  professorSubject = 'Programação Web';

  // Dados fictícios das turmas
  classes: Class[] = [
    {
      id: 1,
      name: 'ADS 4A - Manhã',
      schedule: 'Segunda e Quarta - 08:00 às 10:00',
      room: 'Lab 101',
      students: [
        { id: 1, name: 'João Silva Santos', enrollment: 'ADS2024001', email: 'joao.silva@email.com', grade: 8.5, absences: 3, maxAbsences: 20, classesToRecover: 0, status: 'approved' },
        { id: 2, name: 'Ana Costa Lima', enrollment: 'ADS2024002', email: 'ana.costa@email.com', grade: 7.2, absences: 5, maxAbsences: 20, classesToRecover: 0, status: 'approved' },
        { id: 3, name: 'Carlos Mendes', enrollment: 'ADS2024003', email: 'carlos.mendes@email.com', grade: 6.8, absences: 8, maxAbsences: 20, classesToRecover: 2, status: 'recovery' },
        { id: 4, name: 'Fernanda Alves', enrollment: 'ADS2024004', email: 'fernanda.alves@email.com', grade: 5.5, absences: 12, maxAbsences: 20, classesToRecover: 4, status: 'recovery' },
        { id: 5, name: 'Roberto Lima', enrollment: 'ADS2024005', email: 'roberto.lima@email.com', grade: 9.1, absences: 2, maxAbsences: 20, classesToRecover: 0, status: 'approved' }
      ]
    },
    {
      id: 2,
      name: 'ADS 4B - Noite',
      schedule: 'Terça e Quinta - 19:00 às 21:00',
      room: 'Lab 102',
      students: [
        { id: 6, name: 'Pedro Santos', enrollment: 'ADS2024006', email: 'pedro.santos@email.com', grade: 4.2, absences: 15, maxAbsences: 20, classesToRecover: 6, status: 'failed' },
        { id: 7, name: 'Mariana Oliveira', enrollment: 'ADS2024007', email: 'mariana.oliveira@email.com', grade: 8.8, absences: 4, maxAbsences: 20, classesToRecover: 0, status: 'approved' },
        { id: 8, name: 'Lucas Ferreira', enrollment: 'ADS2024008', email: 'lucas.ferreira@email.com', grade: 6.5, absences: 9, maxAbsences: 20, classesToRecover: 3, status: 'recovery' },
        { id: 9, name: 'Juliana Rocha', enrollment: 'ADS2024009', email: 'juliana.rocha@email.com', grade: 7.9, absences: 6, maxAbsences: 20, classesToRecover: 0, status: 'approved' }
      ]
    }
  ];

  // Estados do componente
  selectedClass: Class | null = null;
  selectedStudent: Student | null = null;
  selectedStudentForChat: Student | null = null;
  showGradeModal = false;
  showAbsenceModal = false;
  showChatModal = false;
  
  // Formulários
  newGrade = 0;
  newAbsences = 0;
  newMessage = '';

  // Chat
  chatMessages: ChatMessage[] = [];
  filteredChatMessages: ChatMessage[] = [];
  unreadMessages = signal(0);

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser()();
    this.initializeChatMessages();
    this.calculateUnreadMessages();
  }

  logout(): void {
    this.authService.logout();
  }

  // Seleção de turma
  selectClass(selectedClass: Class): void {
    this.selectedClass = selectedClass;
    this.selectedStudent = null;
  }

  // Seleção de aluno
  selectStudent(student: Student): void {
    this.selectedStudent = student;
  }

  // Modal de notas
  openGradeModal(student: Student): void {
    this.selectedStudent = student;
    this.newGrade = student.grade;
    this.showGradeModal = true;
  }

  closeGradeModal(): void {
    this.showGradeModal = false;
    this.selectedStudent = null;
    this.newGrade = 0;
  }

  saveGrade(): void {
    if (this.selectedStudent && this.selectedClass) {
      this.selectedStudent.grade = this.newGrade;
      this.selectedStudent.status = this.calculateStatus(this.newGrade);
      this.closeGradeModal();
    }
  }

  // Modal de faltas
  openAbsenceModal(student: Student): void {
    this.selectedStudent = student;
    this.newAbsences = student.absences;
    this.showAbsenceModal = true;
  }

  closeAbsenceModal(): void {
    this.showAbsenceModal = false;
    this.selectedStudent = null;
    this.newAbsences = 0;
  }

  saveAbsences(): void {
    if (this.selectedStudent && this.selectedClass) {
      this.selectedStudent.absences = this.newAbsences;
      this.selectedStudent.classesToRecover = this.calculateClassesToRecover(this.newAbsences);
      this.closeAbsenceModal();
    }
  }

  // Chat
  openChatModal(): void {
    this.showChatModal = true;
    this.markAllMessagesAsRead();
    this.updateFilteredMessages();
  }

  closeChatModal(): void {
    this.showChatModal = false;
    this.selectedStudentForChat = null;
    this.filteredChatMessages = [];
  }

  selectStudentForChat(student: Student): void {
    this.selectedStudentForChat = student;
    this.updateFilteredMessages();
  }

  updateFilteredMessages(): void {
    if (this.selectedStudentForChat) {
      this.filteredChatMessages = this.chatMessages.filter(
        msg => msg.studentId === this.selectedStudentForChat!.id || 
               (msg.isFromProfessor && msg.studentId === this.selectedStudentForChat!.id)
      );
    } else {
      this.filteredChatMessages = this.chatMessages;
    }
  }

  getStudentsWithMessages(): Student[] {
    const studentIds = [...new Set(this.chatMessages.map(msg => msg.studentId))];
    const allStudents = this.classes.flatMap(classItem => classItem.students);
    return allStudents.filter(student => studentIds.includes(student.id));
  }

  getUnreadCountForStudent(studentId: number): number {
    return this.chatMessages.filter(msg => 
      msg.studentId === studentId && !msg.read
    ).length;
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedStudentForChat) return;

    const message: ChatMessage = {
      id: Date.now(),
      studentId: this.selectedStudentForChat.id,
      studentName: this.professorName,
      message: this.newMessage,
      timestamp: new Date(),
      read: true,
      isFromProfessor: true
    };

    this.chatMessages.push(message);
    this.newMessage = '';
    this.updateFilteredMessages();
  }

  // Cálculos
  calculateStatus(grade: number): 'approved' | 'recovery' | 'failed' {
    if (grade >= 7) return 'approved';
    if (grade >= 5) return 'recovery';
    return 'failed';
  }

  calculateClassesToRecover(absences: number): number {
    if (absences <= 20) return 0;
    return Math.ceil((absences - 20) / 2);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'recovery': return 'status-recovery';
      case 'failed': return 'status-failed';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'recovery': return 'Recuperação';
      case 'failed': return 'Reprovado';
      default: return '';
    }
  }

  // Estatísticas
  getTotalStudents(): number {
    return this.classes.reduce((total, classItem) => total + classItem.students.length, 0);
  }

  getAverageGrade(): number {
    const allStudents = this.classes.flatMap(classItem => classItem.students);
    const total = allStudents.reduce((sum, student) => sum + student.grade, 0);
    return Math.round((total / allStudents.length) * 10) / 10;
  }

  getStudentsInRecovery(): number {
    const allStudents = this.classes.flatMap(classItem => classItem.students);
    return allStudents.filter(student => student.status === 'recovery').length;
  }

  getStudentsFailed(): number {
    const allStudents = this.classes.flatMap(classItem => classItem.students);
    return allStudents.filter(student => student.status === 'failed').length;
  }

  // Chat
  private initializeChatMessages(): void {
    this.chatMessages = [
      {
        id: 1,
        studentId: 1,
        studentName: 'João Silva Santos',
        message: 'Professor, tenho dúvidas sobre a próxima prova. Podemos conversar?',
        timestamp: new Date(Date.now() - 3600000),
        read: false
      },
      {
        id: 2,
        studentId: 3,
        studentName: 'Carlos Mendes',
        message: 'Preciso repor algumas aulas. Que horários você tem disponível?',
        timestamp: new Date(Date.now() - 1800000),
        read: false
      },
      {
        id: 3,
        studentId: 4,
        studentName: 'Fernanda Alves',
        message: 'Professor, posso entregar o trabalho até sexta-feira?',
        timestamp: new Date(Date.now() - 900000),
        read: false
      }
    ];
    this.updateFilteredMessages();
  }

  private calculateUnreadMessages(): void {
    this.unreadMessages.set(this.chatMessages.filter(msg => !msg.read).length);
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
}
