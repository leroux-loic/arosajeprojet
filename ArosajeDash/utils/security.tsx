import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


class Security {

    /**
     * Retourne true si l'utilisateur est Administrateur
     * @param userId Id de l'utilisateur
     * @returns 
     */
    static async isAdmin(userId : string) : Promise<boolean> {
        
        var isAdmin = false;
        try {
            // Récupération des roles de l'utilisateur
            const rolesUtilisateur = await prisma.roleUtilisateur.findMany({
                where: {
                utilisateurId: userId,
                },
                include: {
                role: true,
                },
            });
            //Retourne true si l'utilisateur est Admin
            isAdmin = rolesUtilisateur.some((roleUtilisateur) => roleUtilisateur.role?.nom === 'Administrateur');

        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur :', error);
        } finally {
            await prisma.$disconnect();
            
        }

        return isAdmin;
    }

    /**
     * Verifie si le mot de passe correspond aux critères de sécurité
     * @param password 
     * @returns 
     */
    static isPasswordSecure(password : string) {
        var hasValidLength = false;
        // Vérifie si la longueur du mot de passe est d'au moins 8 caractères
        if (password.length >= 8) {
           hasValidLength = true;
        }
      
        // Vérifie s'il y a au moins une majuscule, une minuscule, un chiffre et un caractère spécial
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
        // Retourne true si toutes les conditions sont satisfaites, sinon false
        return hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar && hasValidLength;
      }

      /**
       * Vérifie si l'adresse email est au bon format
       * @param email 
       * @returns 
       */
      static isValidEmail(email : string) {
        // Expression régulière pour la validation d'une adresse e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
        // Vérifie si l'adresse e-mail correspond à la regex
        return emailRegex.test(email);
      }
  
}

export default Security;