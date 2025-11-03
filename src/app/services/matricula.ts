import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService, User } from './auth';

export interface MatriculaItem {
	alunoId: number;
	turmaId: string;
	notaFinal: number | null;
	faltas: number | null;
	updatedAt: string;
}

export interface UpsertMatriculaPayload {
	notaFinal: number;
	faltas: number;
}

@Injectable({ providedIn: 'root' })
export class MatriculaService {
	private readonly http = inject(HttpClient);
	private readonly auth = inject(AuthService);
	private readonly API_BASE = 'http://localhost:8080/api';

	private getCurrentUserId(): number | null {
		const userSig = this.auth.getCurrentUser();
		const user: User | null = userSig();
		return user ? Number(user.id) : null;
	}

	listByTurma(turmaId: string): Observable<MatriculaItem[]> {
		return this.http.get<MatriculaItem[]>(`${this.API_BASE}/professores/turmas/${encodeURIComponent(turmaId)}/matriculas`);
	}

	getByTurmaAndAluno(turmaId: string, alunoId: number): Observable<MatriculaItem> {
		return this.http.get<MatriculaItem>(`${this.API_BASE}/professores/turmas/${encodeURIComponent(turmaId)}/matriculas/${alunoId}`);
	}

	upsert(turmaId: string, alunoId: number, payload: UpsertMatriculaPayload): Observable<MatriculaItem> {
		return this.http.put<MatriculaItem>(`${this.API_BASE}/professores/turmas/${encodeURIComponent(turmaId)}/matriculas/${alunoId}`, payload);
	}

	listMine(): Observable<MatriculaItem[]> {
		const alunoId = this.getCurrentUserId();
		return this.http.get<MatriculaItem[]>(`${this.API_BASE}/alunos/${alunoId}/matriculas`);
	}
}
