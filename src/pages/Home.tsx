import { Link, NavLink } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="site-logo">Магазин<span>.</span></Link>
          <nav className="site-nav">
            <NavLink to="/" end>Главная</NavLink>
            <NavLink to="/catalog">Каталог</NavLink>
          </nav>
        </div>
      </header>

      <section className="hero">
        <span className="hero__eyebrow">Новая коллекция</span>
        <h1 className="hero__title">Качественная продукция для каждого</h1>
        <p className="hero__subtitle">
          Широкий ассортимент товаров от проверенных производителей.
          Найдите именно то, что вам нужно.
        </p>
        <div className="hero__actions">
          <Link to="/catalog" className="btn btn--primary">
            Каталог →
          </Link>
          <Link to="/catalog" className="btn btn--ghost">
            Подробнее
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-card__icon">★</div>
          <h3>Премиум качество</h3>
          <p>Только проверенные товары от надёжных поставщиков с гарантией качества.</p>
        </div>
        <div className="feature-card">
          <div className="feature-card__icon">⚡</div>
          <h3>Быстрая доставка</h3>
          <p>Доставляем по всей стране в кратчайшие сроки с отслеживанием заказа.</p>
        </div>
        <div className="feature-card">
          <div className="feature-card__icon">♥</div>
          <h3>Поддержка 24/7</h3>
          <p>Наша команда поддержки всегда готова помочь с выбором и оформлением.</p>
        </div>
      </section>
    </>
  )
}
