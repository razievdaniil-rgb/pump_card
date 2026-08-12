import type { PumpResult, SelectionContext } from './types';
export const initialContext:SelectionContext={q:32.4,h:48.5,pumpType:'Центробежный In-Line',fluid:'Вода чистая',temperature:20,density:998,viscosity:1,dn:'DN50 / DN50',pn:'PN16',material:'Чугун',seal:'Механическое уплотнение'};
export const pumpTypes=[['Центробежный In-Line','Для циркуляционных систем'],['Консольный','Для технологических линий'],['Погружной','Для скважин и резервуаров'],['Канализационный','Для загрязнённых сред'],['Многоступенчатый','Для высокого напора'],['Дозировочный','Для точной подачи']];
export const results:PumpResult[]=[
{id:'RFZ-026347',name:'APGS-InLine 50-200/5.5',article:'APGS-IL-50200-55',score:97,level:'recommended',minQ:12,minH:18,maxQ:80,maxH:72,power:5.5,efficiency:78.2,dn:'DN50 / PN16',reasons:[]},
{id:'RFZ-026351',name:'APGS-InLine 50-160/4.0',article:'APGS-IL-50160-40',score:87,level:'suitable',minQ:10,minH:15,maxQ:60,maxH:58,power:4,efficiency:74,dn:'DN50 / PN16',reasons:[]},
{id:'RFZ-026359',name:'APGS-InLine 50-250/7.5',article:'APGS-IL-50250-75',score:78,level:'possible',minQ:16,minH:25,maxQ:90,maxH:90,power:7.5,efficiency:76,dn:'DN50 / PN16',reasons:[]},
{id:'RFZ-026401',name:'APGS-InLine 40-200/3.0',article:'APGS-IL-40200-30',score:72,level:'possible',minQ:8,minH:16,maxQ:50,maxH:72,power:3,efficiency:69,dn:'DN40 / PN16',reasons:[]},
{id:'RFZ-026410',name:'APGS-InLine 32-125/1.5',article:'APGS-IL-32125-15',score:20,level:'excluded',minQ:4,minH:8,maxQ:25,maxH:35,power:1.5,efficiency:61,dn:'DN32 / PN16',reasons:[]}
];