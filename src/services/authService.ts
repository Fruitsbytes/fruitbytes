import { Player } from '../facade/character';
import { Observable } from 'rxjs';

export class AuthService {
  private static _instance: AuthService;
  player : Player | undefined;
  player$:Observable<Player | undefined>;

  private constructor(){
    this.player$ = Player.observable;
    this.player$.subscribe(value => {
      this.player= value ? new Player(value) : undefined;
    })
  }

  public static instance(): AuthService {
    if (!AuthService._instance) {
      AuthService._instance = new AuthService();
    }
    return AuthService._instance;
  }
}
