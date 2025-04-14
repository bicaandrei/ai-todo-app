export interface Todo {
    id: number;
    title: string;
    description: string | null;
    status: 'pending' | 'completed';
    due_date: string | null;
    user_id: number | null;
}

export interface TodoFormData {
    title: string;
    description: string;
    status: 'pending' | 'completed';
    due_date: string;
} 