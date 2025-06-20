import React, { useCallback, useEffect, useRef, useState } from 'react'
// sonnerをインポート
import { Toaster, toast } from 'sonner'
// shadcn/uiのコンポーネントのインポートパスを修正
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@shadcn/components/ui/alert-dialog'
import { Button } from '@shadcn/components/ui/button'
import { Card, CardDescription, CardTitle } from '@shadcn/components/ui/card'
import { Input } from '@shadcn/components/ui/input'
import { Label } from '@shadcn/components/ui/label'
import { Slider } from '@shadcn/components/ui/slider'
import { Switch } from '@shadcn/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shadcn/components/ui/tabs'
import { ChevronDown, ChevronUp } from 'lucide-react'

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        return savedTheme === 'dark'
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  const [sliderValue, setSliderValue] = useState([50])
  // 現在のスライドを管理するstate
  const [currentSlide, setCurrentSlide] = useState(0)
  // スクロールイベントの重複実行を防ぐためのフラグ
  const isScrolling = useRef(false)
  const totalSlides = 3
  // スクロール可能なスライドのためのRef
  const gallerySlideRef = useRef<HTMLDivElement>(null)

  // 次のスライドへ移動
  const nextSlide = useCallback(() => {
    if (isScrolling.current) return
    isScrolling.current = true
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
    setTimeout(() => {
      isScrolling.current = false
    }, 1000) // アニメーション時間 + バッファ
  }, [totalSlides])

  // 前のスライドへ移動
  const prevSlide = useCallback(() => {
    if (isScrolling.current) return
    isScrolling.current = true
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
    setTimeout(() => {
      isScrolling.current = false
    }, 1000) // アニメーション時間 + バッファ
  }, [totalSlides])

  useEffect(() => {
    const root = document.documentElement
    if (isDarkMode) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  // マウスホイールによるスライド遷移
  useEffect(() => {
    const handleWheel = (e: WheelEvent): void => {
      if (isScrolling.current) return

      if (e.deltaY > 0) {
        // 下にスクロール
        nextSlide()
      } else if (e.deltaY < 0) {
        // 上にスクロール
        prevSlide()
      }
    }

    window.addEventListener('wheel', handleWheel)
    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [nextSlide, prevSlide])

  // ギャラリースライド内でのスクロール処理
  const handleGalleryWheel = (e: React.WheelEvent<HTMLDivElement>): void => {
    const el = gallerySlideRef.current
    if (el) {
      // スクロールが末端に達しているかチェック
      const isAtTop = el.scrollTop === 0
      const isAtBottom = Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 1

      if (e.deltaY < 0 && isAtTop) {
        // 上端で上にスクロールした場合、スライドを遷移させる
        return
      }
      if (e.deltaY > 0 && isAtBottom) {
        // 下端で下にスクロールした場合、スライドを遷移させる
        return
      }
      // それ以外の場合はスライド遷移をキャンセルし、スライド内のスクロールを優先
      e.stopPropagation()
    }
  }

  const handleThemeToggle = (): void => {
    setIsDarkMode(!isDarkMode)
  }

  const handleAlertConfirm = (): void => {
    toast.success('アクション実行', {
      description: 'デモアクションが実行されました。',
      duration: 3000
    })
  }

  // 各スライドのコンテンツを定義
  const slides = [
    // Slide 1: Hello
    <div
      className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
      key="hello"
    >
      <div className="text-center">
        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight">
          ⚡ Electron-Vite-Shadcn
        </h1>
        <p className="text-primary-foreground/90 mt-4 text-xl lg:text-2xl">
          モダンなデスクトップアプリ開発の新しい形。Shadcn UIでリッチなUIを体験。
        </p>
      </div>
    </div>,

    // Slide 2: Features
    <div className="w-full h-full flex flex-col items-center justify-center p-8" key="features">
      <h2 className="text-4xl font-bold mb-12 text-center">主な特徴</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="bg-muted/30 p-6 rounded-lg shadow-sm">
          <CardTitle className="text-2xl font-bold mb-3">🚀 高速な開発</CardTitle>
          <CardDescription className="text-lg">
            ViteとElectronの組み合わせで、驚くほど高速な開発体験を提供します。ホットリロードで変更が即座に反映されます。
          </CardDescription>
        </Card>
        <Card className="bg-muted/30 p-6 rounded-lg shadow-sm">
          <CardTitle className="text-2xl font-bold mb-3">🎨 美しいUI</CardTitle>
          <CardDescription className="text-lg">
            Shadcn UIとTailwind
            CSSにより、カスタマイズ可能で美しいコンポーネントを簡単に利用できます。ダークモードにも対応。
          </CardDescription>
        </Card>
      </div>
    </div>,

    // Slide 3: Component Gallery
    <div
      ref={gallerySlideRef}
      onWheel={handleGalleryWheel}
      className="w-full h-full overflow-y-auto p-4 md:p-8"
      key="gallery"
    >
      <div className="w-full max-w-6xl mx-auto my-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">コンポーネントギャラリー</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <CardTitle className="text-xl mb-4">インタラクティブ要素</CardTitle>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">様々なボタン</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button>デフォルト</Button>
                  <Button variant="secondary">セカンダリー</Button>
                  <Button variant="outline">アウトライン</Button>
                  <Button variant="ghost">ゴースト</Button>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">値スライダー: {sliderValue[0]}</h3>
                <Slider
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  onValueChange={setSliderValue}
                  className="w-full"
                />
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <CardTitle className="text-xl mb-4">高度なコンポーネント</CardTitle>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">設定タブ</h3>
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile">プロフィール</TabsTrigger>
                    <TabsTrigger value="settings">設定</TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="profile"
                    className="mt-4 p-4 border rounded-lg bg-background text-foreground"
                  >
                    <p className="text-sm mb-2">プロフィールの情報を編集できます。</p>
                    <Input placeholder="名前" className="mt-2" />
                  </TabsContent>
                  <TabsContent
                    value="settings"
                    className="mt-4 p-4 border rounded-lg bg-background text-foreground"
                  >
                    <p className="text-sm mb-2">アプリの全般設定を調整します。</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch id="notifications" />
                      <Label htmlFor="notifications">通知を有効にする</Label>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">確認ダイアログ</h3>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">アクションを実行</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>本当に実行しますか？</AlertDialogTitle>
                      <AlertDialogDescription>
                        このアクションは元に戻すことができません。ご注意ください。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction onClick={handleAlertConfirm}>実行</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  ]

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background text-foreground">
      <Toaster richColors position="top-right" />

      {/* 背景グラデーション */}
      <style>
        {`
          @keyframes gradient-animation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animated-gradient {
            background: linear-gradient(270deg, hsl(var(--accent)), hsl(var(--secondary)), hsl(var(--primary)));
            background-size: 600% 600%;
            animation: gradient-animation 15s ease infinite;
          }
          .dark .animated-gradient {
            background: linear-gradient(270deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)));
            background-size: 600% 600%;
            animation: gradient-animation 15s ease infinite;
          }
        `}
      </style>
      <div className="absolute inset-0 z-0 animated-gradient opacity-10"></div>

      {/* テーマ切り替えスイッチ */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
        <Label htmlFor="theme-toggle">ダークモード</Label>
        <Switch id="theme-toggle" checked={isDarkMode} onCheckedChange={handleThemeToggle} />
      </div>

      {/* スライドコンテナ */}
      <div
        className="h-full w-full transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateY(-${currentSlide * 100}vh)` }}
      >
        {slides.map((slide, index) => (
          <section key={index} className="h-screen w-screen">
            {slide}
          </section>
        ))}
      </div>

      {/* ナビゲーションボタン */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2 z-20 flex flex-col space-y-2">
        <Button variant="outline" size="icon" onClick={prevSlide}>
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={nextSlide}>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      {/* スライドインジケーター */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 z-20 flex flex-col space-y-3">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full cursor-pointer transition-all ${currentSlide === index ? 'bg-primary scale-150' : 'bg-muted-foreground'}`}
          />
        ))}
      </div>
    </div>
  )
}

export default App
