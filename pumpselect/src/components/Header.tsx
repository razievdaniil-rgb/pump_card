import { Icon } from './Icon';

export function Header() {
  return <header className="selector-header">
    <div className="brand"><h1>Программа подбора насосов</h1><p>Подберите насос по рабочей точке и параметрам системы</p></div>
    <nav aria-label="Основная навигация">
      <button><Icon name="spec" />Спецификация</button>
      <button><Icon name="compare" />Сравнение <span className="counter">3</span></button>
      <button className="active"><Icon name="search" />Подбор</button>
      <button><Icon name="catalog" />Каталог</button>
      <button className="quote"><Icon name="cart" />Получить КП</button>
    </nav>
  </header>;
}
