import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, TextInput, FlatList, StatusBar, SafeAreaView, Platform, KeyboardAvoidingView, Image, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// --- TEMA VISUAL ---
const THEME = {
  bg: '#050B14',          // Ultra Dark
  surface: '#101622',     // Card Surface
  surfaceLight: '#1F2937',
  primary: '#6366F1',     // Indigo
  accent: '#06B6D4',      // Cyan Neon
  success: '#10B981',     // Green
  warning: '#F59E0B',     // Amber
  text: '#F8FAFC',
  textSec: '#64748B',
  danger: '#EF4444',
  border: '#1E293B'
};

const PERFIS = ['André', 'Pedro', 'Paulo', 'Convidado'];
const DIAS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
const CATEGORIAS = ['Todos', 'Peito', 'Costas', 'Perna', 'Ombro', 'Braço', 'Abs', 'Cardio'];

// --- BANCO DE DADOS GIGANTE ---
const DB_GIGANTE = [
  // ==================== PEITO (ID 100-199) ====================
  { 
    id: 101, nome: 'Supino Reto Barra', cat: 'Peito', gif: '', 
    padrao: { s: 4, r: '8-12', kg: '20', rest: 90 }, 
    anatomia: { 'Peitoral Maior': 70, 'Tríceps': 20, 'Deltoide Ant.': 10 } 
  },
  { 
    id: 102, nome: 'Supino Inclinado Halter', cat: 'Peito', gif: '', 
    padrao: { s: 3, r: '10-12', kg: '18', rest: 60 }, 
    anatomia: { 'Peitoral Superior': 75, 'Tríceps': 15, 'Deltoide Ant.': 10 } 
  },
  { 
    id: 103, nome: 'Supino Declinado', cat: 'Peito', gif: '', 
    padrao: { s: 3, r: '12', kg: '20', rest: 60 }, 
    anatomia: { 'Peitoral Inferior': 70, 'Tríceps': 20, 'Latíssimos': 10 } 
  },
  { 
    id: 104, nome: 'Crucifixo Máquina (Peck Deck)', cat: 'Peito', gif: '', 
    padrao: { s: 3, r: '15', kg: '30', rest: 45 }, 
    anatomia: { 'Peitoral Maior': 90, 'Deltoide Ant.': 10 } 
  },
  { 
    id: 105, nome: 'Crossover Polia Alta', cat: 'Peito', gif: '', 
    padrao: { s: 4, r: '15', kg: '15', rest: 45 }, 
    anatomia: { 'Peitoral Inferior': 65, 'Peitoral Maior': 25, 'Deltoide Ant.': 10 } 
  },
  { 
    id: 106, nome: 'Crossover Polia Baixa', cat: 'Peito', gif: '', 
    padrao: { s: 4, r: '15', kg: '10', rest: 45 }, 
    anatomia: { 'Peitoral Superior': 70, 'Peitoral Maior': 20, 'Deltoide Ant.': 10 } 
  },
  { 
    id: 107, nome: 'Flexão de Braço (Push-up)', cat: 'Peito', gif: '', 
    padrao: { s: 3, r: 'Falha', kg: '0', rest: 60 }, 
    anatomia: { 'Peitoral Maior': 60, 'Tríceps': 25, 'Core': 15 } 
  },
  { 
    id: 108, nome: 'Paralelas (Foco Peito)', cat: 'Peito', gif: '', 
    padrao: { s: 3, r: '8-12', kg: '0', rest: 90 }, 
    anatomia: { 'Peitoral Inferior': 50, 'Tríceps': 40, 'Deltoide Ant.': 10 } 
  },
  { 
    id: 109, nome: 'Pullover Halter', cat: 'Peito', gif: '', 
    padrao: { s: 3, r: '12', kg: '14', rest: 60 }, 
    anatomia: { 'Serrátil': 30, 'Peitoral Maior': 30, 'Latíssimos': 40 } 
  },

  // ==================== COSTAS (ID 200-299) ====================
  { 
    id: 201, nome: 'Puxada Alta Aberta (Frente)', cat: 'Costas', gif: '', 
    padrao: { s: 4, r: '10-12', kg: '40', rest: 60 }, 
    anatomia: { 'Latíssimos': 70, 'Bíceps': 15, 'Redondo Maior': 15 } 
  },
  { 
    id: 202, nome: 'Puxada Triângulo', cat: 'Costas', gif: '', 
    padrao: { s: 3, r: '12', kg: '40', rest: 60 }, 
    anatomia: { 'Latíssimos (Inferior)': 60, 'Bíceps': 25, 'Romboides': 15 } 
  },
  { 
    id: 203, nome: 'Remada Curvada Barra', cat: 'Costas', gif: '', 
    padrao: { s: 4, r: '8', kg: '30', rest: 90 }, 
    anatomia: { 'Dorsal': 50, 'Trapézio Med.': 20, 'Lombar': 15, 'Bíceps': 15 } 
  },
  { 
    id: 204, nome: 'Remada Cavalinho', cat: 'Costas', gif: '', 
    padrao: { s: 4, r: '10', kg: '40', rest: 90 }, 
    anatomia: { 'Dorsal (Espessura)': 60, 'Trapézio': 20, 'Bíceps': 20 } 
  },
  { 
    id: 205, nome: 'Levantamento Terra', cat: 'Costas', gif: '', 
    padrao: { s: 3, r: '5', kg: '60', rest: 180 }, 
    anatomia: { 'Lombar': 30, 'Glúteo': 25, 'Posterior Coxa': 25, 'Trapézio': 20 } 
  },
  { 
    id: 206, nome: 'Remada Unilateral (Serrote)', cat: 'Costas', gif: '', 
    padrao: { s: 3, r: '12', kg: '20', rest: 60 }, 
    anatomia: { 'Latíssimos': 75, 'Bíceps': 15, 'Deltoide Post.': 10 } 
  },
  { 
    id: 207, nome: 'Barra Fixa (Pronada)', cat: 'Costas', gif: '', 
    padrao: { s: 3, r: 'Falha', kg: '0', rest: 90 }, 
    anatomia: { 'Latíssimos': 65, 'Bíceps': 20, 'Antebraço': 15 } 
  },
  { 
    id: 208, nome: 'Barra Fixa (Supinada/Chin-up)', cat: 'Costas', gif: '', 
    padrao: { s: 3, r: 'Falha', kg: '0', rest: 90 }, 
    anatomia: { 'Bíceps': 50, 'Latíssimos': 40, 'Antebraço': 10 } 
  },
  { 
    id: 209, nome: 'Face Pull', cat: 'Costas', gif: '', 
    padrao: { s: 4, r: '15', kg: '15', rest: 45 }, 
    anatomia: { 'Deltoide Post.': 60, 'Manguito Rotador': 20, 'Trapézio': 20 } 
  },

  // ==================== PERNA (ID 300-399) ====================
  // --- Quadríceps ---
  { 
    id: 301, nome: 'Agachamento Livre', cat: 'Perna', gif: '', 
    padrao: { s: 4, r: '6-8', kg: '40', rest: 120 }, 
    anatomia: { 'Quadríceps': 55, 'Glúteo': 30, 'Adutores': 10, 'Lombar': 5 } 
  },
  { 
    id: 302, nome: 'Leg Press 45', cat: 'Perna', gif: '', 
    padrao: { s: 4, r: '10-12', kg: '100', rest: 90 }, 
    anatomia: { 'Quadríceps': 65, 'Glúteo': 25, 'Posterior': 10 } 
  },
  { 
    id: 303, nome: 'Cadeira Extensora', cat: 'Perna', gif: '', 
    padrao: { s: 4, r: '15', kg: '40', rest: 45 }, 
    anatomia: { 'Quadríceps': 100 } 
  },
  { 
    id: 304, nome: 'Agachamento Búlgaro', cat: 'Perna', gif: '', 
    padrao: { s: 3, r: '10', kg: '10', rest: 90 }, 
    anatomia: { 'Quadríceps': 50, 'Glúteo': 40, 'Estabilidade': 10 } 
  },
  { 
    id: 305, nome: 'Passada (Afundo)', cat: 'Perna', gif: '', 
    padrao: { s: 3, r: '12', kg: '12', rest: 60 }, 
    anatomia: { 'Glúteo': 50, 'Quadríceps': 45, 'Panturrilha': 5 } 
  },
  // --- Posterior/Glúteo ---
  { 
    id: 306, nome: 'Mesa Flexora', cat: 'Perna', gif: '', 
    padrao: { s: 4, r: '12', kg: '35', rest: 60 }, 
    anatomia: { 'Posterior de Coxa': 90, 'Panturrilha': 10 } 
  },
  { 
    id: 307, nome: 'Stiff Barra', cat: 'Perna', gif: '', 
    padrao: { s: 3, r: '10', kg: '30', rest: 90 }, 
    anatomia: { 'Posterior de Coxa': 60, 'Glúteo': 25, 'Lombar': 15 } 
  },
  { 
    id: 308, nome: 'Elevação Pélvica', cat: 'Perna', gif: '', 
    padrao: { s: 4, r: '10', kg: '50', rest: 90 }, 
    anatomia: { 'Glúteo Máximo': 80, 'Posterior de Coxa': 15, 'Quadríceps': 5 } 
  },
  { 
    id: 309, nome: 'Cadeira Abdutora', cat: 'Perna', gif: '', 
    padrao: { s: 3, r: '20', kg: '40', rest: 45 }, 
    anatomia: { 'Glúteo Médio': 90, 'Tensor da Fáscia Lata': 10 } 
  },
  // --- Panturrilha ---
  { 
    id: 310, nome: 'Panturrilha em Pé', cat: 'Perna', gif: '', 
    padrao: { s: 5, r: '15', kg: '50', rest: 30 }, 
    anatomia: { 'Gastrocnêmio': 80, 'Sóleo': 20 } 
  },
  { 
    id: 311, nome: 'Panturrilha Sentado (Banco)', cat: 'Perna', gif: '', 
    padrao: { s: 4, r: '15-20', kg: '30', rest: 30 }, 
    anatomia: { 'Sóleo': 90, 'Gastrocnêmio': 10 } 
  },

  // ==================== OMBRO (ID 400-499) ====================
  { 
    id: 401, nome: 'Desenvolvimento Halter', cat: 'Ombro', gif: '', 
    padrao: { s: 4, r: '8-10', kg: '14', rest: 90 }, 
    anatomia: { 'Deltoide Ant.': 60, 'Deltoide Lat.': 20, 'Tríceps': 20 } 
  },
  { 
    id: 402, nome: 'Desenvolvimento Arnold', cat: 'Ombro', gif: '', 
    padrao: { s: 3, r: '10', kg: '12', rest: 90 }, 
    anatomia: { 'Deltoide Ant.': 50, 'Deltoide Lat.': 30, 'Tríceps': 20 } 
  },
  { 
    id: 403, nome: 'Elevação Lateral', cat: 'Ombro', gif: '', 
    padrao: { s: 4, r: '15', kg: '8', rest: 45 }, 
    anatomia: { 'Deltoide Lat.': 90, 'Trapézio Sup.': 10 } 
  },
  { 
    id: 404, nome: 'Elevação Frontal', cat: 'Ombro', gif: '', 
    padrao: { s: 3, r: '12', kg: '8', rest: 45 }, 
    anatomia: { 'Deltoide Ant.': 85, 'Peitoral Sup.': 15 } 
  },
  { 
    id: 405, nome: 'Crucifixo Inverso', cat: 'Ombro', gif: '', 
    padrao: { s: 4, r: '15', kg: '6', rest: 45 }, 
    anatomia: { 'Deltoide Post.': 70, 'Romboides': 20, 'Trapézio Med.': 10 } 
  },
  { 
    id: 406, nome: 'Remada Alta', cat: 'Ombro', gif: '', 
    padrao: { s: 3, r: '12', kg: '20', rest: 60 }, 
    anatomia: { 'Deltoide Lat.': 50, 'Trapézio': 40, 'Bíceps': 10 } 
  },
  { 
    id: 407, nome: 'Encolhimento Halter', cat: 'Ombro', gif: '', 
    padrao: { s: 4, r: '15', kg: '24', rest: 45 }, 
    anatomia: { 'Trapézio Sup.': 100 } 
  },

  // ==================== BRAÇO (ID 500-599) ====================
  // --- Bíceps ---
  { 
    id: 501, nome: 'Rosca Direta Barra W', cat: 'Braço', gif: '', 
    padrao: { s: 3, r: '10-12', kg: '10', rest: 60 }, 
    anatomia: { 'Bíceps': 85, 'Antebraço': 15 } 
  },
  { 
    id: 502, nome: 'Rosca Martelo', cat: 'Braço', gif: '', 
    padrao: { s: 3, r: '12', kg: '12', rest: 60 }, 
    anatomia: { 'Braquial': 50, 'Bíceps': 30, 'Antebraço (Braquiorradial)': 20 } 
  },
  { 
    id: 503, nome: 'Rosca Scott Máquina', cat: 'Braço', gif: '', 
    padrao: { s: 3, r: '12', kg: '15', rest: 45 }, 
    anatomia: { 'Bíceps (Cabeça Curta)': 90, 'Braquial': 10 } 
  },
  { 
    id: 504, nome: 'Rosca Inclinada Banco', cat: 'Braço', gif: '', 
    padrao: { s: 3, r: '12', kg: '10', rest: 60 }, 
    anatomia: { 'Bíceps (Cabeça Longa)': 80, 'Braquial': 20 } 
  },
  // --- Tríceps ---
  { 
    id: 505, nome: 'Tríceps Corda Polia', cat: 'Braço', gif: '', 
    padrao: { s: 4, r: '15', kg: '15', rest: 45 }, 
    anatomia: { 'Tríceps (Cabeça Lat.)': 60, 'Tríceps (Cabeça Longa)': 40 } 
  },
  { 
    id: 506, nome: 'Tríceps Testa', cat: 'Braço', gif: '', 
    padrao: { s: 3, r: '10-12', kg: '10', rest: 60 }, 
    anatomia: { 'Tríceps (Cabeça Longa)': 70, 'Tríceps (Geral)': 30 } 
  },
  { 
    id: 507, nome: 'Tríceps Coice', cat: 'Braço', gif: '', 
    padrao: { s: 3, r: '15', kg: '5', rest: 45 }, 
    anatomia: { 'Tríceps (Cabeça Longa)': 60, 'Tríceps (Cabeça Lat.)': 40 } 
  },
  { 
    id: 508, nome: 'Mergulho Banco', cat: 'Braço', gif: '', 
    padrao: { s: 3, r: 'Falha', kg: '0', rest: 60 }, 
    anatomia: { 'Tríceps': 70, 'Deltoide Ant.': 20, 'Peitoral': 10 } 
  },
  // --- Antebraço ---
  { 
    id: 509, nome: 'Rosca Inversa', cat: 'Braço', gif: '', 
    padrao: { s: 3, r: '15', kg: '10', rest: 45 }, 
    anatomia: { 'Extensores Punho': 60, 'Braquiorradial': 40 } 
  },
  { 
    id: 510, nome: 'Flexão de Punho', cat: 'Braço', gif: '', 
    padrao: { s: 3, r: '15-20', kg: '10', rest: 30 }, 
    anatomia: { 'Flexores Punho': 100 } 
  },

  // ==================== ABDOMINAL (ID 600-699) ====================
  { 
    id: 601, nome: 'Abdominal Supra (Chão)', cat: 'Abdominal', gif: '', 
    padrao: { s: 4, r: '20', kg: '0', rest: 30 }, 
    anatomia: { 'Reto Abdominal Sup.': 80, 'Oblíquos': 20 } 
  },
  { 
    id: 602, nome: 'Prancha Isométrica', cat: 'Abdominal', gif: '', 
    padrao: { s: 3, r: '60s', kg: '0', rest: 60 }, 
    anatomia: { 'Core (Estabilidade)': 70, 'Reto Abdominal': 20, 'Ombros': 10 } 
  },
  { 
    id: 603, nome: 'Elevação de Pernas (Infra)', cat: 'Abdominal', gif: '', 
    padrao: { s: 3, r: '15', kg: '0', rest: 45 }, 
    anatomia: { 'Reto Abdominal Inf.': 70, 'Flexores de Quadril': 30 } 
  },
  { 
    id: 604, nome: 'Abdominal Remador', cat: 'Abdominal', gif: '', 
    padrao: { s: 3, r: '15', kg: '0', rest: 45 }, 
    anatomia: { 'Reto Abdominal Total': 70, 'Flexores de Quadril': 30 } 
  },
  { 
    id: 605, nome: 'Abdominal Bicicleta', cat: 'Abdominal', gif: '', 
    padrao: { s: 3, r: '20', kg: '0', rest: 30 }, 
    anatomia: { 'Oblíquos': 60, 'Reto Abdominal': 40 } 
  },
  { 
    id: 606, nome: 'Prancha Lateral', cat: 'Abdominal', gif: '', 
    padrao: { s: 3, r: '30s', kg: '0', rest: 45 }, 
    anatomia: { 'Oblíquos': 70, 'Quadrado Lombar': 30 } 
  },
  { 
    id: 607, nome: 'Abdominal na Polia (Crunch)', cat: 'Abdominal', gif: '', 
    padrao: { s: 4, r: '15', kg: '30', rest: 45 }, 
    anatomia: { 'Reto Abdominal': 90, 'Serrátil': 10 } 
  }
];

const SEMANA_VAZIA = { 'DOM':[], 'SEG':[], 'TER':[], 'QUA':[], 'QUI':[], 'SEX':[], 'SAB':[] };

export default function App() {
  const [dbGlobal, setDbGlobal] = useState({
    'André': JSON.parse(JSON.stringify(SEMANA_VAZIA)), 
    'Pedro': JSON.parse(JSON.stringify(SEMANA_VAZIA)),
    'Paulo': JSON.parse(JSON.stringify(SEMANA_VAZIA)),
    'Convidado': JSON.parse(JSON.stringify(SEMANA_VAZIA)),
  });

  const [perfilAtual, setPerfilAtual] = useState(null); 
  const [tela, setTela] = useState('LOGIN'); 
  const [diaAtivo, setDiaAtivo] = useState('SEG');

  // Estados de Edição
  const [modalVisible, setModalVisible] = useState(false);
  const [itemEmEdicao, setItemEmEdicao] = useState(null);
  const [modoEdicao, setModoEdicao] = useState('NOVO');

  const rotinaUsuario = perfilAtual ? dbGlobal[perfilAtual] : SEMANA_VAZIA;
  const listaDoDia = rotinaUsuario[diaAtivo] || [];

  const atualizarDbUsuario = (novaSemana) => {
    setDbGlobal(prev => ({ ...prev, [perfilAtual]: novaSemana }));
  };

  const selecionarPerfil = (nome) => { setPerfilAtual(nome); setTela('HOME'); };
  const fazerLogoff = () => { setPerfilAtual(null); setTela('LOGIN'); };

  const abrirEditor = (item, modo) => {
    const base = item; 
    setItemEmEdicao({
      uid: modo === 'NOVO' ? Date.now().toString() : item.uid,
      nome: base.nome,
      cat: base.cat,
      s: modo === 'NOVO' ? base.padrao.s.toString() : base.s,
      r: modo === 'NOVO' ? base.padrao.r.toString() : base.r,
      kg: modo === 'NOVO' ? base.padrao.kg.toString() : base.kg,
      rest: modo === 'NOVO' ? base.padrao.rest.toString() : base.rest,
      anatomia: base.anatomia || { 'Geral': 100 },
      gif: base.gif || ''
    });
    setModoEdicao(modo);
    setModalVisible(true);
  };

  const salvarItem = () => {
    const final = { 
      ...itemEmEdicao, 
      s: itemEmEdicao.s||'3', r: itemEmEdicao.r||'10', kg: itemEmEdicao.kg||'0', rest: itemEmEdicao.rest||'60' 
    };
    const novaSemana = { ...rotinaUsuario };
    if (modoEdicao === 'NOVO') {
      novaSemana[diaAtivo] = [...novaSemana[diaAtivo], final];
      setTela('HOME');
    } else {
      novaSemana[diaAtivo] = novaSemana[diaAtivo].map(x => x.uid === final.uid ? final : x);
    }
    atualizarDbUsuario(novaSemana);
    setModalVisible(false);
  };

  const deletarItem = (uid) => {
    const novaSemana = { ...rotinaUsuario };
    novaSemana[diaAtivo] = novaSemana[diaAtivo].filter(x => x.uid !== uid);
    atualizarDbUsuario(novaSemana);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.bg} />

      {/* --- LOGIN --- */}
      {tela === 'LOGIN' && (
        <View style={[styles.container, {justifyContent:'center', padding:30}]}>
          <Text style={{color:THEME.textSec, textAlign:'center', letterSpacing:2}}>BEM-VINDO AO</Text>
          <Text style={{color:THEME.text, textAlign:'center', fontSize:32, fontWeight:'900', marginBottom:50}}>TITAN<Text style={{color:THEME.primary}}>OS</Text></Text>
          <View style={styles.gridProfiles}>
            {PERFIS.map(nome => (
              <TouchableOpacity key={nome} style={styles.cardProfile} onPress={() => selecionarPerfil(nome)}>
                <View style={[styles.avatarBig, {backgroundColor: nome === 'Convidado' ? THEME.surfaceLight : THEME.primary}]}>
                  <Text style={{color:'#FFF', fontSize:24, fontWeight:'bold'}}>{nome.charAt(0)}</Text>
                </View>
                <Text style={styles.profileName}>{nome}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* --- HOME --- */}
      {tela === 'HOME' && (
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greetingSmall}>Dashboard de</Text>
              <Text style={styles.greetingBig}>{perfilAtual}</Text>
            </View>
            <TouchableOpacity style={styles.avatar} onPress={fazerLogoff}>
               <Text style={{color:'#FFF', fontWeight:'bold'}}>{perfilAtual?.charAt(0)}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.calendarStrip}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingLeft: 20}}>
              {DIAS.map(d => (
                <TouchableOpacity key={d} onPress={() => setDiaAtivo(d)} style={[styles.dayItem, diaAtivo === d && styles.dayItemActive]}>
                  <Text style={[styles.dayLabel, diaAtivo === d && styles.dayLabelActive]}>{d}</Text>
                  {rotinaUsuario[d] && rotinaUsuario[d].length > 0 && <View style={[styles.dotIndicator, diaAtivo === d ? {backgroundColor: THEME.bg} : {backgroundColor: THEME.primary}]} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.listContainer}>
             <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Treino de {diaAtivo}</Text>
                <TouchableOpacity onPress={() => setTela('SELETOR')}><Text style={styles.linkText}>+ Adicionar</Text></TouchableOpacity>
             </View>

             <FlatList
               data={listaDoDia}
               keyExtractor={item => item.uid}
               contentContainerStyle={{paddingBottom: 100}}
               ListEmptyComponent={
                 <View style={styles.emptyBox}>
                   <MaterialCommunityIcons name="dumbbell" size={50} color={THEME.border} />
                   <Text style={styles.emptyText}>Sem treino hoje.</Text>
                   <TouchableOpacity style={styles.btnOutline} onPress={() => setTela('SELETOR')}>
                      <Text style={{color: THEME.primary, fontWeight:'bold'}}>Montar Agora</Text>
                   </TouchableOpacity>
                 </View>
               }
               renderItem={({item}) => (
                 <TouchableOpacity style={styles.exerciseCard} onPress={() => abrirEditor(item, 'EDITAR')}>
                    <View style={styles.cardContent}>
                       <Text style={styles.cardTitle}>{item.nome}</Text>
                       <Text style={styles.cardSub}>{item.s} séries x {item.r} reps • {item.kg}kg</Text>
                    </View>
                    <TouchableOpacity style={styles.trashBtn} onPress={() => deletarItem(item.uid)}>
                       <Ionicons name="trash-outline" size={18} color={THEME.danger} />
                    </TouchableOpacity>
                 </TouchableOpacity>
               )}
             />
          </View>

          {listaDoDia.length > 0 && (
             <View style={styles.bottomDock}>
                <TouchableOpacity style={styles.btnStart} onPress={() => setTela('TREINAR')}>
                   <Text style={styles.btnStartText}>INICIAR TREINO</Text>
                   <MaterialCommunityIcons name="play" size={24} color="#FFF" />
                </TouchableOpacity>
             </View>
          )}
        </View>
      )}

      {/* --- SELETOR --- */}
      {tela === 'SELETOR' && <SeletorAvancado voltar={() => setTela('HOME')} onSelecionar={(i) => abrirEditor(i, 'NOVO')} />}
      
      {/* --- ENGINE DE TREINO (MELHORADA) --- */}
      {tela === 'TREINAR' && <EngineTreino rotina={listaDoDia} sair={() => setTela('HOME')} />}

      {/* --- MODAL EDITOR --- */}
      <Modal visible={modalVisible} transparent animationType="slide">
         <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
            <View style={styles.modalContent}>
               <View style={styles.modalHeader}>
                 <Text style={styles.modalTitle}>{modoEdicao === 'NOVO' ? 'Novo' : 'Editar'}</Text>
                 <TouchableOpacity onPress={() => setModalVisible(false)}><Ionicons name="close" size={24} color={THEME.textSec}/></TouchableOpacity>
               </View>
               
               {itemEmEdicao && (
                 <ScrollView>
                   <Text style={{color:THEME.primary, fontSize:20, fontWeight:'bold', textAlign:'center', marginBottom:20}}>{itemEmEdicao.nome}</Text>
                   <View style={styles.inputGrid}>
                      <InputBox label="Séries" val={itemEmEdicao.s} onChange={t => setItemEmEdicao({...itemEmEdicao, s:t})} />
                      <InputBox label="Reps" val={itemEmEdicao.r} onChange={t => setItemEmEdicao({...itemEmEdicao, r:t})} />
                      <InputBox label="Carga (kg)" val={itemEmEdicao.kg} onChange={t => setItemEmEdicao({...itemEmEdicao, kg:t})} />
                      <InputBox label="Descanso (s)" val={itemEmEdicao.rest} onChange={t => setItemEmEdicao({...itemEmEdicao, rest:t})} />
                   </View>
                   <TouchableOpacity onPress={salvarItem} style={styles.btnSave}><Text style={{color:'#FFF', fontWeight:'bold'}}>SALVAR</Text></TouchableOpacity>
                 </ScrollView>
               )}
            </View>
         </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// --- ENGINE DE TREINO PRO ---
function EngineTreino({ rotina, sair }) {
   const [total, setTotal] = useState(0);
   const [local, setLocal] = useState(0);
   const [idx, setIdx] = useState(0);
   const [serie, setSerie] = useState(1);
   const [modo, setModo] = useState('WORK');
   const ex = rotina[idx];

   useEffect(() => {
      const i = setInterval(() => { setTotal(t=>t+1); setLocal(l=>l+1); }, 1000);
      return () => clearInterval(i);
   }, []);
   
   const fmt = (s) => { const m = Math.floor(s/60); const sc = s%60; return `${m}:${sc<10?'0'+sc:sc}`; }
   
   const next = () => {
      if(modo==='WORK') { setModo('REST'); setLocal(0); }
      else {
         if(serie < parseInt(ex.s)) { setSerie(s=>s+1); setModo('WORK'); setLocal(0); }
         else {
            if(idx+1 < rotina.length) { setIdx(i=>i+1); setSerie(1); setModo('WORK'); setLocal(0); }
            else { sair(); }
         }
      }
   }

   return (
      <View style={{flex:1, backgroundColor:'#000'}}>
         
         {/* Top Bar */}
         <View style={styles.engineHeader}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
               <View style={{width:8, height:8, borderRadius:4, backgroundColor:THEME.danger, marginRight:8}}/>
               <Text style={{color:THEME.text, fontWeight:'bold', fontFamily: Platform.OS==='ios'?'Courier':'monospace'}}>{fmt(total)}</Text>
            </View>
            <TouchableOpacity onPress={sair} style={{padding:5, backgroundColor:THEME.surface, borderRadius:8}}>
               <Ionicons name="close" size={20} color={THEME.textSec} />
            </TouchableOpacity>
         </View>

         {/* ÁREA VISUAL (GIF + ANATOMIA) */}
         <ScrollView contentContainerStyle={{alignItems:'center', paddingBottom: 40}}>
            
            <View style={styles.screenContainer}>
               {ex.gif ? (
                  <Image source={{uri: ex.gif}} style={styles.gifExec} resizeMode="cover" />
               ) : (
                  <View style={styles.gifPlaceholder}>
                     <MaterialCommunityIcons name="arm-flex" size={60} color={THEME.surfaceLight} />
                     <Text style={{color:THEME.textSec, marginTop:10, fontSize:12, letterSpacing:1}}>VISUALIZAÇÃO INDISPONÍVEL</Text>
                  </View>
               )}
               {/* Overlay do Nome */}
               <View style={styles.overlayName}>
                  <Text style={{color:'#FFF', fontWeight:'bold', fontSize:18}}>{ex.nome}</Text>
               </View>
            </View>

            {/* BARRA DE ANATOMIA (SCANNER) */}
            <View style={styles.anatomyBar}>
               <Text style={styles.anatomyLabel}>ATIVAÇÃO ALVO:</Text>
               <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent:'center', gap: 10}}>
                  {Object.entries(ex.anatomia || {'Geral':100}).map(([musculo, pct]) => (
                     <View key={musculo} style={styles.muscleTag}>
                        <View style={{width:8, height:8, borderRadius:4, backgroundColor: pct > 50 ? THEME.primary : THEME.accent, marginRight:6}}/>
                        <Text style={{color:THEME.text, fontSize:12}}>{musculo} <Text style={{color:THEME.textSec}}>{pct}%</Text></Text>
                     </View>
                  ))}
               </View>
            </View>

            {/* CONTROLE PRINCIPAL */}
            <View style={styles.controlPanel}>
               <View style={[styles.timerRing, {borderColor: modo==='WORK' ? THEME.primary : THEME.success}]}>
                  <Text style={styles.timerMain}>{fmt(local)}</Text>
                  <Text style={styles.timerLabel}>{modo==='WORK' ? 'EM EXECUÇÃO' : 'DESCANSO'}</Text>
               </View>

               <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                     <Text style={styles.statLabel}>SÉRIE</Text>
                     <Text style={styles.statVal}>{serie} / {ex.s}</Text>
                  </View>
                  <View style={styles.statBox}>
                     <Text style={styles.statLabel}>CARGA</Text>
                     <Text style={styles.statVal}>{ex.kg}kg</Text>
                  </View>
                  <View style={styles.statBox}>
                     <Text style={styles.statLabel}>REPS</Text>
                     <Text style={styles.statVal}>{ex.r}</Text>
                  </View>
               </View>

               <TouchableOpacity onPress={next} style={[styles.btnAction, {backgroundColor: modo==='WORK' ? THEME.primary : THEME.success}]}>
                  <Text style={styles.btnActionText}>{modo==='WORK' ? 'FINALIZAR SÉRIE' : 'INICIAR PRÓXIMA'}</Text>
                  <MaterialCommunityIcons name={modo==='WORK' ? "check" : "play"} size={24} color="#FFF" />
               </TouchableOpacity>
            </View>

         </ScrollView>
      </View>
   )
}

// --- SELETOR ---
function SeletorAvancado({ voltar, onSelecionar }) {
   const [busca, setBusca] = useState('');
   const filtered = DB_GIGANTE.filter(i => i.nome.toLowerCase().includes(busca.toLowerCase()));
   return (
      <View style={styles.container}>
         <View style={styles.headerRow}>
            <TouchableOpacity onPress={voltar}><Ionicons name="arrow-back" size={24} color={THEME.text}/></TouchableOpacity>
            <Text style={styles.greetingBig}>Biblioteca</Text>
            <View style={{width:24}}/>
         </View>
         <View style={{paddingHorizontal:20, marginBottom:10}}>
            <TextInput style={styles.searchInput} placeholder="Buscar..." placeholderTextColor={THEME.textSec} value={busca} onChangeText={setBusca}/>
         </View>
         <FlatList data={filtered} keyExtractor={i=>i.id.toString()} contentContainerStyle={{padding:20}} renderItem={({item}) => (
            <TouchableOpacity style={styles.exerciseCard} onPress={() => onSelecionar(item)}>
               <MaterialCommunityIcons name="plus-circle" size={24} color={THEME.success} />
               <Text style={[styles.cardTitle, {marginLeft:10}]}>{item.nome}</Text>
            </TouchableOpacity>
         )}/>
      </View>
   )
}

const InputBox = ({ label, val, onChange }) => (
  <View style={{width:'48%', marginBottom:10}}>
    <Text style={{color:THEME.textSec, fontSize:10, marginBottom:4}}>{label}</Text>
    <TextInput style={styles.input} keyboardType="numeric" value={val} onChangeText={onChange} />
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: THEME.bg, paddingTop: Platform.OS === 'android' ? 30 : 0 },
  container: { flex: 1, backgroundColor: THEME.bg },
  gridProfiles: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cardProfile: { width: '48%', backgroundColor: THEME.surface, borderRadius: 16, alignItems: 'center', padding: 20, marginBottom: 15, borderWidth: 1, borderColor: THEME.border },
  avatarBig: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  profileName: { color: THEME.text, fontWeight: 'bold', fontSize: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  greetingSmall: { color: THEME.textSec, fontSize: 14 },
  greetingBig: { color: THEME.text, fontSize: 22, fontWeight: 'bold' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: THEME.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: THEME.border },
  calendarStrip: { marginBottom: 20 },
  dayItem: { width: 50, height: 65, borderRadius: 25, backgroundColor: THEME.surface, marginRight: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: THEME.border },
  dayItemActive: { backgroundColor: THEME.primary, borderColor: THEME.primary },
  dayLabel: { color: THEME.textSec, fontSize: 12, fontWeight: 'bold' },
  dayLabelActive: { color: '#FFF' },
  dotIndicator: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
  listContainer: { flex: 1, backgroundColor: THEME.surface, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { color: THEME.text, fontSize: 18, fontWeight: 'bold' },
  linkText: { color: THEME.primary, fontWeight: 'bold', fontSize: 14 },
  exerciseCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.bg, padding: 12, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: THEME.border },
  cardContent: { flex: 1, marginLeft: 15 },
  cardTitle: { color: THEME.text, fontWeight: 'bold', fontSize: 15 },
  cardSub: { color: THEME.textSec, fontSize: 12, marginTop: 2 },
  trashBtn: { padding: 8 },
  emptyBox: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: THEME.textSec, marginTop: 10, marginBottom: 20 },
  btnOutline: { borderWidth: 1, borderColor: THEME.primary, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8 },
  bottomDock: { position: 'absolute', bottom: 30, left: 20, right: 20 },
  btnStart: { backgroundColor: THEME.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 56, borderRadius: 28 },
  btnStartText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginRight: 10 },
  input: { backgroundColor: THEME.bg, color: '#FFF', borderWidth: 1, borderColor: THEME.border, borderRadius: 8, padding: 10, textAlign: 'center' },
  searchInput: { backgroundColor: THEME.surface, color: '#FFF', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: THEME.border },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: THEME.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: THEME.border },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { color: THEME.text, fontSize: 18, fontWeight: 'bold' },
  inputGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  btnSave: { backgroundColor: THEME.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  
  // ENGINE STYLES
  engineHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems:'center' },
  screenContainer: { width: Dimensions.get('window').width - 40, height: 220, borderRadius: 20, overflow: 'hidden', marginTop: 10, borderWidth: 1, borderColor: THEME.border, backgroundColor: THEME.surface },
  gifExec: { width: '100%', height: '100%' },
  gifPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: THEME.surfaceLight },
  overlayName: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.7)', padding: 15, alignItems: 'center' },
  anatomyBar: { width: '100%', padding: 20, alignItems: 'center' },
  anatomyLabel: { color: THEME.textSec, fontSize: 10, letterSpacing: 2, marginBottom: 10 },
  muscleTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.surface, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: THEME.border },
  controlPanel: { width: '100%', paddingHorizontal: 20, alignItems: 'center' },
  timerRing: { width: 180, height: 180, borderRadius: 90, borderWidth: 4, alignItems: 'center', justifyContent: 'center', marginBottom: 30, backgroundColor: THEME.surface },
  timerMain: { color: THEME.text, fontSize: 50, fontWeight: 'bold', fontFamily: Platform.OS==='ios'?'Courier':'monospace' },
  timerLabel: { color: THEME.textSec, fontSize: 12, letterSpacing: 1 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 30 },
  statBox: { alignItems: 'center' },
  statLabel: { color: THEME.textSec, fontSize: 10, marginBottom: 5 },
  statVal: { color: THEME.text, fontSize: 20, fontWeight: 'bold' },
  btnAction: { flexDirection: 'row', width: '100%', height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', gap: 10 },
  btnActionText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});