import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth';
import { forkJoin } from 'rxjs';
import { MakeupService } from '../../services/makeup';
import { MatriculaService, MatriculaItem } from '../../services/matricula';

interface Subject {
  name: string;
  grade: number;
  absences: number;
  maxAbsences: number;
  classesToRecover: number;
  professor: string;
  professorEmail: string;
}

interface Professor {
  id: number;
  name: string;
  email: string;
  subject: string;
  avatar: string;
  online: boolean;
}

interface ChatMessage {
  id: number;
  sender: 'student' | 'professor';
  message: string;
  timestamp: Date;
  professorId?: number;
}

interface RecoveryRequest {
  id: number;
  studentName: string;
  studentEnrollment: string;
  subject: string;
  professor: string;
  classesToRecover: number;
  reason: string;
  requestDate: Date;
  status: 'pending' | 'approved' | 'rejected';
}

@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css'
})
export class StudentDashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly makeupService = inject(MakeupService);
  private readonly matriculaService = inject(MatriculaService);

  currentUser: User | null = null;
  
  studentName = 'João Silva';
  studentEnrollment = 'ADS2024001';
  course = 'ADS - 4º Semestre';

  subjects: Subject[] = [
    { name: 'Programação Web', grade: 8.5, absences: 3, maxAbsences: 20, classesToRecover: 0, professor: 'Prof. Maria Oliveira', professorEmail: 'maria.oliveira@faculdade.edu' },
    { name: 'Banco de Dados', grade: 7.2, absences: 5, maxAbsences: 20, classesToRecover: 0, professor: 'Prof. Carlos Mendes', professorEmail: 'carlos.mendes@faculdade.edu' },
    { name: 'Estrutura de Dados', grade: 6.8, absences: 8, maxAbsences: 20, classesToRecover: 2, professor: 'Prof. Ana Costa', professorEmail: 'ana.costa@faculdade.edu' },
    { name: 'Algoritmos', grade: 5.5, absences: 12, maxAbsences: 20, classesToRecover: 4, professor: 'Prof. Roberto Lima', professorEmail: 'roberto.lima@faculdade.edu' },
    { name: 'Eng. Software', grade: 9.1, absences: 2, maxAbsences: 20, classesToRecover: 0, professor: 'Prof. Fernanda Alves', professorEmail: 'fernanda.alves@faculdade.edu' },
    { name: 'Redes', grade: 4.2, absences: 15, maxAbsences: 20, classesToRecover: 6, professor: 'Prof. Pedro Santos', professorEmail: 'pedro.santos@faculdade.edu' }
  ];

  professors: Professor[] = [
    { id: 1, name: 'Prof. Maria Oliveira', email: 'maria.oliveira@faculdade.edu', subject: 'Programação Web', avatar: '👩‍💻', online: true },
    { id: 2, name: 'Prof. Carlos Mendes', email: 'carlos.mendes@faculdade.edu', subject: 'Banco de Dados', avatar: '👨‍💼', online: true },
    { id: 3, name: 'Prof. Ana Costa', email: 'ana.costa@faculdade.edu', subject: 'Estrutura de Dados', avatar: '👩‍🔬', online: false },
    { id: 4, name: 'Prof. Roberto Lima', email: 'roberto.lima@faculdade.edu', subject: 'Algoritmos', avatar: '👨‍🏫', online: true },
    { id: 5, name: 'Prof. Fernanda Alves', email: 'fernanda.alves@faculdade.edu', subject: 'Eng. Software', avatar: '👩‍💼', online: false },
    { id: 6, name: 'Prof. Pedro Santos', email: 'pedro.santos@faculdade.edu', subject: 'Redes', avatar: '👨‍💻', online: true }
  ];

  averageGrade = signal(this.calculateAverage());
  totalClassesToRecover = signal(this.subjects.reduce((sum, s) => sum + s.classesToRecover, 0));

  
  showChat = false;
  selectedProfessor: Professor | null = null;
  newMessage = '';
  chatMessages: ChatMessage[] = [];

 
  showRecoveryModal = false;
  selectedSubject: Subject | null = null;
  recoveryReason = '';
  recoveryRequests: RecoveryRequest[] = [];

  // Adicionar nova propriedade
  showSubjectSelectionModal = false;
  subjectsNeedingRecovery: Subject[] = [];

  // Adicionar novas propriedades para o modal de sucesso
  showSuccessModal = false;
  successMessage = {
    title: '',
    details: [] as { label: string, value: string }[]
  };

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser()();
    this.initializeChatMessages();
    this.fetchMyRequests();
    this.fetchMyGradesFromBackend();
  }

  logout(): void {
    this.authService.logout();
  }

  private calculateAverage(): number {
    const total = this.subjects.reduce((sum, subject) => sum + subject.grade, 0);
    return Math.round((total / this.subjects.length) * 10) / 10;
  }

  getStatus(grade: number): string {
    if (grade >= 7) return 'Aprovado';
    if (grade >= 5) return 'Recuperação';
    return 'Reprovado';
  }

  getStatusClass(grade: number): string {
    if (grade >= 7) return 'approved';
    if (grade >= 5) return 'recovery';
    return 'failed';
  }

  // Modificar a função requestClassRecovery
  requestClassRecovery(): void {
    const subjectsToRecover = this.subjects.filter(s => s.classesToRecover > 0);
    if (subjectsToRecover.length === 0) {
      // Substituir alert por modal
      this.showInfoMessage('Nenhuma aula para repor', 'Você não tem aulas para repor no momento.');
      return;
    }

    // Sempre mostrar o modal de seleção de matérias
    this.subjectsNeedingRecovery = subjectsToRecover;
    this.showSubjectSelectionModal = true;
  }

  // Nova função para selecionar matéria do card
  selectSubjectForRecovery(subject: Subject): void {
    this.showSubjectSelectionModal = false;
    this.openRecoveryModal(subject);
  }

  // Nova função para fechar modal de seleção
  closeSubjectSelectionModal(): void {
    this.showSubjectSelectionModal = false;
    this.subjectsNeedingRecovery = [];
  }

  openRecoveryModal(subject: Subject): void {
    this.selectedSubject = subject;
    this.recoveryReason = '';
    this.showRecoveryModal = true;
  }

  closeRecoveryModal(): void {
    this.showRecoveryModal = false;
    this.selectedSubject = null;
    this.recoveryReason = '';
  }

  submitRecoveryRequest(): void {
    if (!this.selectedSubject || !this.recoveryReason.trim()) {
      this.showInfoMessage('Atenção', 'Por favor, preencha o motivo da solicitação.');
      return;
    }

    this.makeupService.createMakeup({
      subject: this.selectedSubject.name,
      reason: this.recoveryReason
    }).subscribe({
      next: (resp) => {
        const request: RecoveryRequest = {
          id: resp.id,
          studentName: this.studentName,
          studentEnrollment: this.studentEnrollment,
          subject: resp.subject,
          professor: this.selectedSubject!.professor,
          classesToRecover: this.selectedSubject!.classesToRecover,
          reason: resp.reason,
          requestDate: new Date(resp.createdAt),
          status: 'pending'
        };
        this.fetchMyRequests();
        this.showSuccessMessage(
          'Solicitação enviada com sucesso!',
          [
            { label: 'Matéria', value: request.subject },
            { label: 'Professor(a)', value: request.professor },
            { label: 'Aulas para repor', value: request.classesToRecover.toString() },
            { label: 'Data da solicitação', value: this.formatDate(request.requestDate) }
          ]
        );
        this.closeRecoveryModal();
      },
      error: () => {
        this.showInfoMessage('Erro', 'Não foi possível enviar sua solicitação. Tente novamente.');
      }
    });
  }

  private sendRequestToCoordinator(request: RecoveryRequest): void {
  
    console.log('Enviando solicitação para o coordenador:', request);
    
     
  }

  fetchMyRequests(): void {
    const idNum = Number(this.currentUser?.id);
    if (!idNum) return;
    this.makeupService.listMine(idNum).subscribe({
      next: (items) => {
        this.recoveryRequests = items.map((r) => ({
          id: r.id,
          studentName: this.studentName,
          studentEnrollment: this.studentEnrollment,
          subject: r.subject,
          professor: '',
          classesToRecover: 1,
          reason: r.reason,
          requestDate: new Date(r.createdAt),
          status: (r.status?.toLowerCase() as 'pending' | 'approved' | 'rejected') || 'pending'
        }));
      },
      error: () => {
        this.recoveryRequests = [];
      }
    });
  }

  // Busca notas/faltas reais do backend e aplica sobre a matéria de Programação Web
  private fetchMyGradesFromBackend(): void {
    const idNum = Number(this.currentUser?.id);
    if (!idNum) return;
    this.matriculaService.listMine().subscribe({
      next: (items: MatriculaItem[]) => {
        // Exemplo: usar a turma ADS4A-MANHA para refletir em Programação Web
        const m = items.find(i => i.turmaId === 'ADS4A-MANHA');
        if (m) {
          const subject = this.subjects.find(s => s.name === 'Programação Web');
          if (subject) {
            if (typeof m.notaFinal === 'number') subject.grade = m.notaFinal;
            if (typeof m.faltas === 'number') subject.absences = m.faltas;
            this.averageGrade.set(this.calculateAverage());
            this.totalClassesToRecover.set(this.subjects.reduce((sum, s) => sum + s.classesToRecover, 0));
          }
        }
      },
      error: () => { /* silencioso */ }
    });
  }

  clearMine(status: 'PENDING' | 'APPROVED' | 'REJECTED'): void {
    const idNum = Number(this.currentUser?.id);
    if (!idNum) return;
    this.makeupService.deleteMineByStatus(idNum, status).subscribe({
      next: () => this.fetchMyRequests(),
      error: () => this.showInfoMessage('Erro', 'Falha ao limpar solicitações. Tente novamente.')
    });
  }

  clearAllMine(): void {
    const idNum = Number(this.currentUser?.id);
    if (!idNum) return;
    forkJoin([
      this.makeupService.deleteMineByStatus(idNum, 'PENDING'),
      this.makeupService.deleteMineByStatus(idNum, 'APPROVED'),
      this.makeupService.deleteMineByStatus(idNum, 'REJECTED')
    ]).subscribe({
      next: () => this.fetchMyRequests(),
      error: () => this.showInfoMessage('Erro', 'Falha ao limpar solicitações. Tente novamente.')
    });
  }

  getRequestStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovada';
      case 'rejected': return 'Rejeitada';
      default: return '';
    }
  }

  getRequestStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR');
  }

  // Funções do chat
  openChat(professor: Professor): void {
    this.selectedProfessor = professor;
    this.showChat = true;
  }

  closeChat(): void {
    this.showChat = false;
    this.selectedProfessor = null;
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedProfessor) return;

    const currentProfessor = this.selectedProfessor;

    const message: ChatMessage = {
      id: Date.now(),
      sender: 'student',
      message: this.newMessage,
      timestamp: new Date(),
      professorId: currentProfessor.id
    };

    this.chatMessages.push(message);
    this.newMessage = '';

    // Simular resposta do professor após 2 segundos
    setTimeout(() => {
      const responses = [
        'Olá! Como posso ajudá-lo?',
        'Entendi sua solicitação. Vamos agendar as reposições.',
        'Que horários você tem disponível?',
        'Perfeito! Vou verificar minha agenda.',
        'Podemos marcar para próxima semana?',
        'Ótimo! Enviei um email com os detalhes.'
      ];

      const professorResponse: ChatMessage = {
        id: Date.now() + 1,
        sender: 'professor',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        professorId: currentProfessor.id
      };

      this.chatMessages.push(professorResponse);
    }, 2000);
  }

  private initializeChatMessages(): void {
    // Mensagens iniciais de exemplo
    this.chatMessages = [
      {
        id: 1,
        sender: 'professor',
        message: 'Olá! Estou aqui para ajudar com suas dúvidas sobre reposição de aulas.',
        timestamp: new Date(Date.now() - 3600000),
        professorId: 1
      }
    ];
  }

  getMessagesForProfessor(professorId: number): ChatMessage[] {
    return this.chatMessages.filter(msg => msg.professorId === professorId);
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  getProfessorBySubject(subjectName: string): Professor | null {
    return this.professors.find(p => p.subject === subjectName) || null;
  }

  // Nova função helper para abrir chat a partir da matéria
  openChatForSubject(subjectName: string): void {
    const professor = this.getProfessorBySubject(subjectName);
    if (professor) {
      this.openChat(professor);
    }
  }

  // Nova função para mostrar mensagem de sucesso
  showSuccessMessage(title: string, details: { label: string, value: string }[]): void {
    this.successMessage = { title, details };
    this.showSuccessModal = true;
  }

  // Nova função para mostrar mensagem informativa
  showInfoMessage(title: string, message: string): void {
    this.successMessage = { 
      title, 
      details: [{ label: '', value: message }] 
    };
    this.showSuccessModal = true;
  }

  // Nova função para fechar modal de sucesso
  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.successMessage = { title: '', details: [] };
  }
}
