import type { SelectionMode } from '../domain/types';
import { Icon } from './Icon';

export function StartScenario({ onSelect }: { onSelect: (mode: SelectionMode) => void }) {
  return <main className="start-shell card">
    <div className="start-copy"><span className="eyebrow">Инженерный подбор</span><h2>Как вы хотите найти насос?</h2><p>Выберите самый быстрый сценарий. Параметры можно изменить на любом следующем шаге.</p></div>
    <div className="scenario-grid">
      <button className="scenario primary-choice" onClick={() => onSelect('qh')}><span className="scenario-icon"><Icon name="gauge" size={24}/></span><strong>Знаю Q и H</strong><small>Подбор по рабочей точке и параметрам системы</small><span className="scenario-action">Начать подбор →</span></button>
      <button className="scenario" onClick={() => onSelect('model')}><span className="scenario-icon"><Icon name="search" size={24}/></span><strong>Знаю модель</strong><small>Поиск по названию, артикулу или аналогу</small><span className="scenario-action">Найти модель →</span></button>
      <button className="scenario" onClick={() => onSelect('assistant')}><span className="scenario-icon"><Icon name="bot" size={24}/></span><strong>Не знаю параметров</strong><small>AI-помощник задаст вопросы и подготовит исходные данные</small><span className="scenario-action">Получить помощь →</span></button>
    </div>
  </main>;
}
