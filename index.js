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
const DIAS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
const CATEGORIAS = ['Todos', 'Peito', 'Costas', 'Perna', 'Ombro', 'Braço', 'Abs', 'Cardio'];

// --- BANCO DE DADOS GIGANTE ---
const DB_GIGANTE = [
  // --- PEITO ---
  { id: 101, nome: 'Supino Reto Barra', cat: 'Peito', gif: 'https://i.imgur.com/0v8Xz1X.gif', padrao: { s: 4, r: '10', kg: '20', rest: 60 }, anatomia: { 'Peitoral Maior': 70, 'Tríceps': 20, 'Deltoide Ant.': 10 } },
  { id: 102, nome: 'Supino Inclinado Halter', cat: 'Peito', gif: '', padrao: { s: 3, r: '12', kg: '18', rest: 60 }, anatomia: { 'Peitoral Superior': 75, 'Tríceps': 15, 'Deltoide Ant.': 10 } },
  { id: 103, nome: 'Crucifixo Máquina', cat: 'Peito', gif: '', padrao: { s: 3, r: '15', kg: '30', rest: 45 }, anatomia: { 'Peitoral Maior': 90, 'Deltoide Ant.': 10 } },
  // --- COSTAS ---
  { id: 201, nome: 'Puxada Alta Aberta', cat: 'Costas', gif: '', padrao: { s: 4, r: '10', kg: '40', rest: 60 }, anatomia: { 'Latíssimos': 70, 'Bíceps': 20, 'Redondo Maior': 10 } },
  { id: 202, nome: 'Remada Curvada', cat: 'Costas', gif: '', padrao: { s: 4, r: '8', kg: '30', rest: 90 }, anatomia: { 'Dorsal': 60, 'Lombar': 20, 'Bíceps': 20 } },
  // --- PERNA ---
  { id: 301, nome: 'Agachamento Livre', cat: 'Perna', gif: '', padrao: { s: 4, r: '8', kg: '40', rest: 120 }, anatomia: { 'Quadríceps': 60, 'Glúteo': 25, 'Lombar': 10 } },
  { id: 302, nome: 'Leg Press 45', cat: 'Perna', gif: '', padrao: { s: 4, r: '12', kg: '100', rest: 90 }, anatomia: { 'Quadríceps': 70, 'Glúteo': 20, 'Posterior': 10 } },
  // --- OMBRO ---
  { id: 401, nome: 'Desenvolvimento', cat: 'Ombro', gif: '', padrao: { s: 4, r: '10', kg: '14', rest: 60 }, anatomia: { 'Deltoide Ant.': 60, 'Deltoide Lat.': 20, 'Tríceps': 20 } },
  { id: 402, nome: 'Elevação Lateral', cat: 'Ombro', gif: '', padrao: { s: 4, r: '15', kg: '8', rest: 45 }, anatomia: { 'Deltoide Lat.': 90, 'Trapézio': 10 } },
  // --- BRAÇO ---
  { id: 501, nome: 'Rosca Direta', cat: 'Braço', gif: '', padrao: { s: 3, r: '12', kg: '10', rest: 60 }, anatomia: { 'Bíceps': 90, 'Antebraço': 10 } },
  { id: 502, nome: 'Tríceps Corda', cat: 'Braço', gif: '', padrao: { s: 4, r: '15', kg: '15', rest: 45 }, anatomia: { 'Tríceps': 100 } },
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
