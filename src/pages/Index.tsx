import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
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
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentNote, setCurrentNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [lectures] = useState<Lecture[]>([
    {
      id: '1',
      title: 'Введение в квантовую механику',
      duration: '1:24:35',
      date: '15.11.2024',
      subject: 'Физика',
      notes: [
        { id: '1', time: '00:05:23', text: 'Определение волновой функции', isImportant: true },
        { id: '2', time: '00:23:45', text: 'Принцип неопределённости Гейзенберга', isImportant: true },
        { id: '3', time: '00:45:12', text: 'Примеры решения задач', isImportant: false },
      ]
    },
    {
      id: '2',
      title: 'Алгоритмы сортировки',
      duration: '0:58:20',
      date: '14.11.2024',
      subject: 'Информатика',
      notes: [
        { id: '1', time: '00:10:15', text: 'Сложность быстрой сортировки', isImportant: true },
        { id: '2', time: '00:35:40', text: 'Сравнение алгоритмов', isImportant: false },
      ]
    },
    {
      id: '3',
      title: 'История Древнего Рима',
      duration: '1:15:45',
      date: '13.11.2024',
      subject: 'История',
      notes: [
        { id: '1', time: '00:08:30', text: 'Основание Рима - 753 г. до н.э.', isImportant: true },
        { id: '2', time: '00:42:10', text: 'Пунические войны', isImportant: true },
      ]
    }
  ]);

  const [scheduledLectures] = useState<ScheduledLecture[]>([
    {
      id: '1',
      title: 'Математический анализ',
      subject: 'Математика',
      date: '18.11.2024',
      time: '10:00'
    },
    {
      id: '2',
      title: 'Органическая химия',
      subject: 'Химия',
      date: '19.11.2024',
      time: '14:30'
    },
    {
      id: '3',
      title: 'Философия Просвещения',
      subject: 'Философия',
      date: '20.11.2024',
      time: '09:00'
    }
  ]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Icon name="Settings" size={16} className="mr-2" />
                Настройки
              </Button>
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
                        <span className="text-sm font-medium">Идёт запись...</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Input placeholder="Название лекции" />
                    <Input placeholder="Предмет" />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1"
                      size="lg"
                      variant={isRecording ? "destructive" : "default"}
                      onClick={() => setIsRecording(!isRecording)}
                    >
                      <Icon name={isRecording ? "Square" : "Circle"} size={20} className="mr-2" />
                      {isRecording ? 'Остановить' : 'Начать запись'}
                    </Button>
                    {isRecording && (
                      <Button size="lg" variant="outline">
                        <Icon name="Pause" size={20} />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      <Icon name="Mic" size={16} className="mr-2" />
                      Аудио
                    </Button>
                    <Button variant="outline" size="sm">
                      <Icon name="Video" size={16} className="mr-2" />
                      Видео
                    </Button>
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
                      <Button className="flex-1">
                        <Icon name="Plus" size={16} className="mr-2" />
                        Добавить заметку
                      </Button>
                      <Button variant="outline">
                        <Icon name="Star" size={16} />
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="h-[300px] rounded-md border p-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-accent">
                        <Icon name="Star" size={16} className="text-accent mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-muted-foreground">00:00:15</span>
                            <Badge variant="secondary" className="text-xs">Важно</Badge>
                          </div>
                          <p className="text-sm">Определение основных понятий темы</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <Icon name="MessageSquare" size={16} className="text-muted-foreground mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-muted-foreground">00:05:42</span>
                          </div>
                          <p className="text-sm">Примеры из практики</p>
                        </div>
                      </div>
                    </div>
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
                  <Button variant="outline">
                    <Icon name="Filter" size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>

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
                        <Button size="sm" variant="outline">
                          <Icon name="Play" size={16} />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Icon name="Download" size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Icon name="BookMarked" size={16} />
                        <span>Заметки ({lecture.notes.length})</span>
                      </div>
                      <div className="space-y-2 pl-6">
                        {lecture.notes.slice(0, 2).map((note) => (
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
                </Card>
              ))}
            </div>
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
                  <Input placeholder="Название лекции" />
                  <Input placeholder="Предмет" />
                  <Input type="date" />
                  <Input type="time" />
                </div>
                <Button className="w-full mt-4">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить в расписание
                </Button>
              </CardContent>
            </Card>

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
                        <Button size="sm" variant="outline">
                          <Icon name="Bell" size={16} />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Icon name="Pencil" size={16} />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
