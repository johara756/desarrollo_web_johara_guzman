from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import sessionmaker, declarative_base, relationship

# datos para conectarnos a la base de datos
DATABASE_URL = "mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2"

# conexion con la base de datos
engine = create_engine(DATABASE_URL, echo=False, future=True)

# crear sesiones para trabajar con la base de datos. (consultar o modificar)
SessionLocal = sessionmaker(bind=engine)

# base para crear los modelos
Base = declarative_base()

# --- Models ---

class Region(Base):
    __tablename__ = "region"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)

    comunas = relationship("Comuna", back_populates="region")


class Comuna(Base):
    __tablename__ = "comuna"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    #cada comuna está asociada a una region
    region_id = Column(Integer, ForeignKey("region.id"), nullable=False)

    voluntarios = relationship("Voluntario", back_populates="comuna")
    region = relationship("Region", back_populates="comunas")

#por como esta definido la tabla de comunas, no hacemos un borrado en cascada 
#entre region y comuna. 

class Voluntario(Base):
    __tablename__ = "voluntario"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    email = Column(String(80), nullable=False)
    telefono = Column(String(15), nullable=False)
    fecha_registro = Column(DateTime, nullable=False)
    comuna_id = Column(Integer, ForeignKey("comuna.id"), nullable=False)

    #agregamos las relaciones con otras tablas
    comuna = relationship("Comuna", back_populates="voluntarios")
    avistamientos = relationship("Avistamiento", back_populates="voluntario")


class Ave(Base):
    __tablename__ = "ave"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(80), nullable=False)

    #agregamos las relaciones. Permite acceder a los avistamientos asociados a una ave
    avistamientos = relationship("Avistamiento", back_populates="ave")


class Avistamiento(Base):
    __tablename__ = "avistamiento"

    id = Column(Integer, primary_key=True, autoincrement=True)
    voluntario_id = Column(Integer, ForeignKey("voluntario.id"), nullable=False)
    ave_id = Column(Integer, ForeignKey("ave.id"), nullable=False)
    fecha_hora = Column(DateTime, nullable=False)
    lugar = Column(String(200), nullable=False)
    descripcion = Column(Text(500), nullable=True)

    voluntario = relationship("Voluntario", back_populates="avistamientos")
    ave = relationship("Ave", back_populates="avistamientos")
    # relacion entre Avistamiento y Registro
    registros = relationship("Registro", back_populates="avistamiento")


class Registro(Base):
    __tablename__ = "registro"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    avistamiento_id = Column(Integer, ForeignKey("avistamiento.id"), nullable=False)

    # relacion entre Registro y Avistamiento
    avistamiento = relationship("Avistamiento", back_populates="registros")