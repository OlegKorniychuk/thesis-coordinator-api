export interface StudentUser {
  fullName: string;
  login: string;
  password: string | null;
  group: string;
}

export interface TeacherUser {
  fullName: string;
  login: string;
  password: string | null;
}
