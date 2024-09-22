export type Usuario = {
    id: number;
    nome: string;
    email: string;
}

export function useUsuario() {
    const usuario = useState<Usuario|null>('usuario', () => null)

    return {
        usuario
    }
}