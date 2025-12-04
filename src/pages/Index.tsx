import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Lecture {
  id: string;
  title: string;
  duration: string;
  date: string;
  subject: string;
  notes: Note[];
}

interface Note {
  id: string;
  time: string;
  text: string;
  isImportant: boolean;
}

interface ScheduledLecture {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
}

const Index = () => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentNote, setCurrentNote] = useState('');
  const [markAsImportant, setMarkAsImportant] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureSubject, setLectureSubject] = useState('');
  const [currentNotes, setCurrentNotes] = useState<Note[]>([]);
  
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [scheduledLectures, setScheduledLectures] = useState<ScheduledLecture[]>([]);
  
  const [newScheduleTitle, setNewScheduleTitle] = useState('');
  const [newScheduleSubject, setNewScheduleSubject] = useState('');
  const [newScheduleDate, setNewScheduleDate] = useState('');
  const [newScheduleTime, setNewScheduleTime] = useState('');

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    if (isRecording) {
      if (!lectureTitle.trim() || !lectureSubject.trim()) {
        toast({
          title: "Ошибка",
          description: "Заполните название и предмет лекции перед остановкой",
          variant: "destructive"
        });
        return;
      }
      
      const newLecture: Lecture = {
        id: Date.now().toString(),
        title: lectureTitle,
        subject: lectureSubject,
        duration: formatTime(recordingTime),
        date: new Date().toLocaleDateString('ru-RU'),
        notes: currentNotes
      };
      
      setLectures(prev => [newLecture, ...prev]);
      setIsRecording(false);
      setIsPaused(false);
      setRecordingTime(0);
      setCurrentNotes([]);
      setLectureTitle('');
      setLectureSubject('');
      
      toast({
        title: "Лекция сохранена",
        description: `${lectureTitle} успешно записана`
      });
    } else {
      setIsRecording(true);
      setIsPaused(false);
      toast({
        title: "Запись начата",
        description: "Введите название и предмет лекции"
      });
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleAddNote = () => {
    if (!currentNote.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите текст заметки",
        variant: "destructive"
      });
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      time: formatTime(recordingTime),
      text: currentNote,
      isImportant: markAsImportant
    };

    setCurrentNotes(prev => [...prev, newNote]);
    setCurrentNote('');
    setMarkAsImportant(false);
    
    toast({
      title: "Заметка добавлена",
      description: `${markAsImportant ? '⭐ Важная' : 'Обычная'} заметка в ${formatTime(recordingTime)}`
    });
  };

  const handleDeleteLecture = (id: string) => {
    setLectures(prev => prev.filter(l => l.id !== id));
    toast({
      title: "Лекция удалена",
      description: "Лекция успешно удалена из библиотеки"
    });
  };

  const handleAddSchedule = () => {
    if (!newScheduleTitle.trim() || !newScheduleSubject.trim() || !newScheduleDate || !newScheduleTime) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }

    const newSchedule: ScheduledLecture = {
      id: Date.now().toString(),
      title: newScheduleTitle,
      subject: newScheduleSubject,
      date: new Date(newScheduleDate).toLocaleDateString('ru-RU'),
      time: newScheduleTime
    };

    setScheduledLectures(prev => [...prev, newSchedule]);
    setNewScheduleTitle('');
    setNewScheduleSubject('');
    setNewScheduleDate('');
    setNewScheduleTime('');
    
    toast({
      title: "Лекция запланирована",
      description: `${newSchedule.title} добавлена в расписание`
    });
  };

  const handleDeleteSchedule = (id: string) => {
    setScheduledLectures(prev => prev.filter(s => s.id !== id));
    toast({
      title: "Лекция удалена",
      description: "Лекция удалена из расписания"
    });
  };

  const filteredLectures = lectures.filter(lecture =>
    lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lecture.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Icon name="GraduationCap" size={28} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Академия Лекций</h1>
                <p className="text-sm text-muted-foreground">Система управления образовательным контентом</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="record" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="record" className="flex items-center gap-2">
              <Icon name="Video" size={18} />
              Запись лекции
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Icon name="Library" size={18} />
              Библиотека
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Icon name="Calendar" size={18} />
              Планировщик
            </TabsTrigger>
          </TabsList>

          <TabsContent value="record" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Video" size={20} />
                    Управление записью
                  </CardTitle>
                  <CardDescription>Контроль аудио и видео записи лекции</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted rounded-lg p-8 flex flex-col items-center justify-center space-y-4">
                    <div className="text-6xl font-bold font-mono text-primary">
                      {formatTime(recordingTime)}
                    </div>
                    {isRecording && (
                      <div className="flex items-center gap-2 text-destructive">
                        <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                        <span className="text-sm font-medium">
                          {isPaused ? 'Пауза' : 'Идёт запись...'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Input 
                      placeholder="Название лекции" 
                      value={lectureTitle}
                      onChange={(e) => setLectureTitle(e.target.value)}
                    />
                    <Input 
                      placeholder="Предмет" 
                      value={lectureSubject}
                      onChange={(e) => setLectureSubject(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1"
                      size="lg"
                      variant={isRecording ? "destructive" : "default"}
                      onClick={handleStartStop}
                    >
                      <Icon name={isRecording ? "Square" : "Circle"} size={20} className="mr-2" />
                      {isRecording ? 'Остановить' : 'Начать запись'}
                    </Button>
                    {isRecording && (
                      <Button 
                        size="lg" 
                        variant="outline"
                        onClick={handlePause}
                      >
                        <Icon name={isPaused ? "Play" : "Pause"} size={20} />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="StickyNote" size={20} />
                    Заметки и метки
                  </CardTitle>
                  <CardDescription>Добавляйте важные моменты с временными метками</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Введите заметку..."
                      value={currentNote}
                      onChange={(e) => setCurrentNote(e.target.value)}
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1"
                        onClick={handleAddNote}
                      >
                        <Icon name="Plus" size={16} className="mr-2" />
                        Добавить заметку
                      </Button>
                      <Button 
                        variant={markAsImportant ? "default" : "outline"}
                        onClick={() => setMarkAsImportant(!markAsImportant)}
                      >
                        <Icon name="Star" size={16} />
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="h-[300px] rounded-md border p-4">
                    {currentNotes.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <Icon name="FileText" size={48} className="mb-2 opacity-50" />
                        <p className="text-sm">Заметки появятся здесь</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {currentNotes.map((note) => (
                          <div 
                            key={note.id} 
                            className={`flex items-start gap-3 p-3 rounded-lg ${
                              note.isImportant 
                                ? 'bg-accent/10 border border-accent' 
                                : 'bg-muted/50'
                            }`}
                          >
                            <Icon 
                              name={note.isImportant ? "Star" : "MessageSquare"} 
                              size={16} 
                              className={`${note.isImportant ? 'text-accent' : 'text-muted-foreground'} mt-1`}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-mono text-muted-foreground">{note.time}</span>
                                {note.isImportant && (
                                  <Badge variant="secondary" className="text-xs">Важно</Badge>
                                )}
                              </div>
                              <p className="text-sm">{note.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Search" size={20} />
                  Поиск лекций
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    placeholder="Поиск по названию или предмету..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </CardContent>
            </Card>

            {filteredLectures.length === 0 ? (
              <Card>
                <CardContent className="pt-8 pb-8">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Icon name="Library" size={64} className="mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Библиотека пуста</h3>
                    <p className="text-sm">Записанные лекции появятся здесь</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredLectures.map((lecture) => (
                  <Card key={lecture.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{lecture.title}</CardTitle>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Icon name="Clock" size={14} />
                              <span>{lecture.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Icon name="Calendar" size={14} />
                              <span>{lecture.date}</span>
                            </div>
                            <Badge variant="secondary">{lecture.subject}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteLecture(lecture.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    {lecture.notes.length > 0 && (
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Icon name="BookMarked" size={16} />
                            <span>Заметки ({lecture.notes.length})</span>
                          </div>
                          <div className="space-y-2 pl-6">
                            {lecture.notes.slice(0, 3).map((note) => (
                              <div key={note.id} className="flex items-start gap-2 text-sm">
                                <span className="font-mono text-xs text-muted-foreground mt-0.5">{note.time}</span>
                                <span className="flex-1">{note.text}</span>
                                {note.isImportant && (
                                  <Icon name="Star" size={14} className="text-accent" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="CalendarPlus" size={20} />
                  Запланировать лекцию
                </CardTitle>
                <CardDescription>Добавьте новую лекцию в расписание</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input 
                    placeholder="Название лекции" 
                    value={newScheduleTitle}
                    onChange={(e) => setNewScheduleTitle(e.target.value)}
                  />
                  <Input 
                    placeholder="Предмет" 
                    value={newScheduleSubject}
                    onChange={(e) => setNewScheduleSubject(e.target.value)}
                  />
                  <Input 
                    type="date" 
                    value={newScheduleDate}
                    onChange={(e) => setNewScheduleDate(e.target.value)}
                  />
                  <Input 
                    type="time" 
                    value={newScheduleTime}
                    onChange={(e) => setNewScheduleTime(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full mt-4"
                  onClick={handleAddSchedule}
                >
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить в расписание
                </Button>
              </CardContent>
            </Card>

            {scheduledLectures.length === 0 ? (
              <Card>
                <CardContent className="pt-8 pb-8">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Icon name="Calendar" size={64} className="mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Расписание пусто</h3>
                    <p className="text-sm">Запланированные лекции появятся здесь</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {scheduledLectures.map((lecture) => (
                  <Card key={lecture.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-accent/10 rounded-lg border border-accent">
                            <Icon name="Calendar" size={24} className="text-accent" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{lecture.title}</h3>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <Badge variant="secondary">{lecture.subject}</Badge>
                              <div className="flex items-center gap-1">
                                <Icon name="Calendar" size={14} />
                                <span>{lecture.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Icon name="Clock" size={14} />
                                <span>{lecture.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteSchedule(lecture.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;